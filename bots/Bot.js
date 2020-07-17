/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
const { Telegraf } = require('telegraf');
const session = require('telegraf/session');
const fs = require('fs');
const { BOT_TOKEN } = require('../config/config');
const User = require('../models/User');

const bot = new Telegraf(BOT_TOKEN);

/* Include middlewares */
bot.use(session());

/* Generating array of skills from file. */
const generateSkillsList = () => {
  const buttons = [];
  const ids = [];
  const jsonedData = JSON.parse(fs.readFileSync('skills.json', 'utf8'));
  jsonedData.forEach((element) => {
    buttons.push([{ text: element.name, callback_data: element.id }]);
    ids.push(element.id);
  });
  return [buttons, ids];
};

/* Handle start command. Greeting user. */
bot.start(async (ctx) => {
  const buttons = generateSkillsList();
  /* Check on existing user. Add new if don't exist. */
  const allUsers = await User.find({ userId: ctx.from.id });
  if (allUsers.length === 0) {
    const user = new User({
      userId: ctx.from.id,
      username: ctx.from.username,
      first_name: ctx.from.first_name,
      last_name: ctx.from.last_name,
      skills: [],
    });
    user.save();
  }
  ctx.session.skills = buttons[0];
  ctx.session.selectedSkills = [];
  ctx.reply(
    `Здравствуйте, *${ctx.from.first_name} ${ctx.from.last_name}*!\n`
    + 'Вас приветствует _FreelancehuntBot_.\n\n'
    + 'В данном чате Вы можете _отслеживать новые проекты_ с фриланс-биржи *Freelancehunt*.\n'
    + 'Перед началом отслеживания проектов, _нажмите на кнопку ниже_.',
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[{ text: 'Выбрать категории', callback_data: 'selectSkills' }]],
      },
    },
  );
});

/* Handle callback query. Reacting on ckilcked inline button. */
bot.on('callback_query', async (ctx) => {
  const buttons = generateSkillsList();
  /* Start selecting some skills. */
  if (ctx.callbackQuery.data === 'selectSkills') {
    /* Cleaning up the chat. */
    ctx.deleteMessage(ctx.callbackQuery.message.message_id - 1);

    ctx.editMessageText(
      'Выберите категории, _на которых Вы специализируетесь_.',
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: ctx.session.skills,
        },
      },
    );
  } else if (buttons[1].includes(+ctx.callbackQuery.data)) {
    /* Deleting selected skills. Add it in user array. */
    const skills = Object.values(ctx.session.skills);
    for (let item = 0; item < skills.length; item += 1) {
      if (skills[item][0].callback_data === +ctx.callbackQuery.data) {
        ctx.session.skills.splice(item, 1);
      }
    }
    ctx.session.selectedSkills.push(+ctx.callbackQuery.data);
    /* Delete selected button from inline button. */
    ctx.editMessageText(
      'Выберите категории, _на которых Вы специализируетесь_.\n\n'
      + 'Чтобы _закончить выбор_, нажмите /stopSelecting',
      {
        reply_markup: {
          inline_keyboard: ctx.session.skills,
        },
        parse_mode: 'Markdown',
      },
    );
  }
});

/* Write user skills to collection. */
bot.command('stopSelecting', async (ctx) => {
  /* Cleaning up the chat. */
  // ctx.deleteMessage(ctx.message.message_id);
  try {
    await User.updateOne({ userId: ctx.from.id }, {
      ids: ctx.session.selectedSkills,
    });
  } catch (e) {
    console.error(e);
  }
  // ctx.editMessageText(
  //   'Вы выбрали категории.\n\n'
  //   + 'Для того, что бы начать отслеживать проекты нажмите кнопку ниже',
  //   {
  //     reply_markup: {
  //       inline_keyboard: [
  //         [{ text: 'Отслеживать проекты', callback_data: 'trackProjects' }],
  //       ],
  //     },
  //   },
  // );
});

/* Error hadling */
bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

/* Start launching bot */
bot.launch();
