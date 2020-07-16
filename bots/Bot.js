const { Telegraf } = require('telegraf');
const fs = require('fs');
const { BOT_TOKEN } = require('../config/config');
const User = require('../models/User');

const bot = new Telegraf(BOT_TOKEN);

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

/* User temporary data */
const users = {};

/* Connect all bot functions */
const startBot = async () => {
  /* Handle start command. Greeting user. */
  bot.start(async (ctx) => {
    /* Check on existing user. Add new if don't exist. */
    const allUsers = await User.find({ userId: ctx.from.id });
    const buttons = generateSkillsList();
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
    users[`skills_${ctx.from.id}`] = buttons[0];
    users[`selectedSkills_${ctx.from.id}`] = [];
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
            inline_keyboard: users[`skills_${ctx.from.id}`],
          },
        },
      );
    }

    /* Add new skill to user list. */
    else if (buttons[1].includes(+ctx.callbackQuery.data)) {
      /* Deleting selected skills. Add it in user array. */
      const skills = Object.values(users[`skills_${ctx.from.id}`]);
      for (let item = 0; item < skills.length; item += 1) {
        if (skills[item][0].callback_data === +ctx.callbackQuery.data) {
          users[`skills_${ctx.from.id}`].splice(item, 1);
        }
      }
      users[`selectedSkills_${ctx.from.id}`].push(+ctx.callbackQuery.data);

      /* Delete selected button from inline button. */
      ctx.editMessageText(
        'Выберите категории, _на которых Вы специализируетесь_.\n\n'
        + 'Чтобы _закончить выбор_, нажмите /stopSelecting',
        {
          reply_markup: {
            inline_keyboard: users[`skills_${ctx.from.id}`],
          },
          parse_mode: 'Markdown',
        },
      );
    }
  });

  /* Write user skills to collection. */
  bot.command('stopSelecting', async (ctx) => {
    /* Cleaning up the chat. */
    ctx.deleteMessage(ctx.message.message_id - 1);
    await User.updateOne({ userId: ctx.from.id }, {
      ids: Array.from(users[`selectedSkills_${ctx.from.id}`])
    });
  });

  /* Start launching bot */
  bot.launch();
};

module.exports = startBot;
