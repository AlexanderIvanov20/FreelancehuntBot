/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
const fs = require('fs');
const { Telegraf } = require('telegraf');
const session = require('telegraf/session');
const { Console } = require('console');
const User = require('../models/User');
const { connectToDatabase } = require('../database');
const { BOT_TOKEN } = require('../config/config');
const { Tracker } = require('../tracker');
const { userCreateMiddleware } = require('../middleware/userCreate');
const scraper = require('../scraper');

/** Logging in files for production. */
const loggerOptions = {
  stdout: fs.createWriteStream('./var/out.log'),
  stderr: fs.createWriteStream('./var/err.log'),
};
const logger = new Console(loggerOptions);

const bot = new Telegraf(BOT_TOKEN);

/**
 * ? Connect to database.
 */
connectToDatabase();

/**
 * ? Include middlewares.
 */
bot.use(session());
bot.use(userCreateMiddleware);

/**
 * * Generating array of skills from file.
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
 * * Handle start command. Greeting user.
 */
bot.start((ctx) => {
  logger.log('Start command. Create user session and add he/she in a database.');
  const buttons = generateSkillsList();
  /** Initialize default user fields in session. */
  ctx.session.skills = buttons[0];
  ctx.session.selectedSkills = [];
  ctx.session.tracker = new Tracker();
  /** Greeting. */
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
 * * Handle callback query. Reacting on ckilcked inline button.
 */
bot.on('callback_query', (ctx) => {
  const buttons = generateSkillsList();
  /** Start selecting some skills. */
  if (ctx.callbackQuery.data === 'selectSkills') {
    /** Cleaning up the chat. */
    ctx.telegram.deleteMessage(ctx.chat.id, ctx.callbackQuery.message.message_id - 1);

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
  } else if (ctx.callbackQuery.data === 'trackProjects') {
    /** Cleaning up the chat. */
    ctx.telegram.deleteMessage(ctx.chat.id, ctx.callbackQuery.message.message_id);
    /** Calling method (sendProjects) of Tracker class */
    ctx.session.tracker.sendProject(ctx.session.selectedSkills)
      .then((newProjects) => {
        newProjects.forEach((element) => {
          /** Transform getted data and send it to user. */
          const realAmount = (element.amount !== -1) ? element.amount : 'Договорная';
          ctx.reply(
            `<b><a href="${element.link}">${element.name}</a></b>\n\n`
            + `${element.description.trim()}\n\n`
            + `Цена: <i>${realAmount} ${element.currency}</i>\n`
            + `Заказчик: <a href="${element.customer_link}">${element.customer_first_name} `
            + `${element.customer_last_name}</a>\n\n`
            + `Дата публикации: ${element.publish_date}`,
            {
              parse_mode: 'HTML',
              disable_web_page_preview: true,
            },
          );
        });
      })
      .catch((err) => {
        ctx.reply(err, { parse_mode: 'Markdown' });
      });
  }
});

/**
 * * Write user skills to collection.
 */
bot.command('stopSelecting', (ctx) => {
  /** Cleaning up the chat. */
  ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
  ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id - 1);
  /** Update user's skills. */
  User.updateOne({ userId: ctx.from.id }, {
    ids: ctx.session.selectedSkills,
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

if (process.argv[process.argv.length] === 'production') {
/**
 * ! Error hadling.
 *
 * @param {any} err If error exists, get it.
 * @param {object} ctx Get context.
 * @param {void} ctx Print message in console.
 */
  bot.catch((err, ctx) => {
    logger.error(`Ooops, encountered an error for ${ctx.updateType}`, err);
  });
}

/**
 * * Start launching bot.
 */
bot.launch();

/**
 * ? Periodically get new projects.
 */
setInterval(() => {
  scraper.addProjects();
}, 5000);
