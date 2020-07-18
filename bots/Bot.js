/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
const { Telegraf } = require('telegraf');
const session = require('telegraf/session');
const fs = require('fs');
const mongoose = require('mongoose');
const { BOT_TOKEN, DB_PASSWORD } = require('../config/config');
const User = require('../models/User');

/**
 * ? Connect to database.
 */
(async () => {
  try {
    await mongoose.connect(`mongodb+srv://alexander:${DB_PASSWORD}@cluster0.rkfw4.mongodb.net/freelancehuntBot`, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (e) { throw new Error(e); }
})();

const bot = new Telegraf(BOT_TOKEN);

/**
 * ? Include middlewares.
 */
bot.use(session());

/**
 * ? Generating array of skills from file.
 */
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

/**
 * ? Handle start command. Greeting user.
 */
bot.start((ctx) => {
  const buttons = generateSkillsList();
  /** Check on existing user. Add new if don't exist. */
  User.find({ userId: ctx.from.id }, (err, res) => {
    if (res.length === 0) {
      User.create({
        userId: ctx.from.id,
        username: ctx.from.username,
        first_name: ctx.from.first_name,
        last_name: ctx.from.last_name,
        skills: [],
      });
    }
  });
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

/**
 * ? Handle callback query. Reacting on ckilcked inline button.
 */
bot.on('callback_query', (ctx) => {
  const buttons = generateSkillsList();
  /** Start selecting some skills. */
  if (ctx.callbackQuery.data === 'selectSkills') {
    /** Cleaning up the chat. */
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
    /** Deleting selected skills. Add it in user array. */
    const skills = Object.values(ctx.session.skills);
    for (let item = 0; item < skills.length; item += 1) {
      if (skills[item][0].callback_data === +ctx.callbackQuery.data) {
        ctx.session.skills.splice(item, 1);
      }
    }
    ctx.session.selectedSkills.push(+ctx.callbackQuery.data);
    /** Delete selected button from inline button. */
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

/**
 * ? Write user skills to collection.
 */
bot.command('stopSelecting', (ctx) => {
  /** Cleaning up the chat. */
  ctx.deleteMessage(ctx.message.message_id);
  ctx.deleteMessage(ctx.message.message_id - 1);
  /** Update user's skills. */
  User.updateOne({ userId: ctx.from.id }, {
    ids: ctx.session.selectedSkills,
  }, (err, res) => {
    console.log(res);
  });

  ctx.reply(
    'Вы выбрали категории!\n\n'
    + 'Для того, что бы начать _отслеживать проекты_ нажмите *кнопку* ниже',
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Отслеживать проекты', callback_data: 'trackProjects' }],
        ],
      },
      parse_mode: 'Markdown',
    },
  );
});

/**
 * ? Error hadling.
 */
bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

/** Start launching bot. */
bot.launch();
