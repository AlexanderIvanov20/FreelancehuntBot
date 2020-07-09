const { Telegraf } = require('telegraf');
const { BOT_TOKEN } = require('../config/config');
const fs = require('fs');
const User = require('../models/User');


const bot = new Telegraf(BOT_TOKEN);

const generateSkillsList = () => {
  var buttons = [];
  var jsonedData = JSON.parse(fs.readFileSync('skills.json', 'utf8'));
  jsonedData.forEach(element => {
    buttons.push([{ text: element.name, callback_data: element.id }]);
  });
  return buttons;
}


const startBot = async () => {
  // Handle start command. Greeting user
  bot.start(async (ctx) => {
    const allUsers = await User.find({ userId: ctx.from.id });
    if (allUsers == []) {
      const user = new User({
        userId: ctx.from.id,
        username: ctx.from.username,
        first_name: ctx.from.first_name,
        last_name: ctx.from.last_name,
        skills: []
      });
      user.save();
    }

    ctx.reply(
      `Здравствуйте, *${ctx.from.first_name} ${ctx.from.last_name}*!\n` +
      `Вас приветствует _FreelancehuntBot_.\n\n` +
      `В данном чате Вы можете _отслеживать новые проекты_ с фриланс-биржи *Freelancehunt*.\n` +
      `Перед началом отслеживания проектов, _нажмите на кнопку ниже_.`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "Выбрать категории", callback_data: "selectSkills" }]]
        }
      }
    )
  });

  // Handle callback query. Reacting on ckilcked inline button
  bot.on('callback_query', (ctx) => {
    if (ctx.callbackQuery.data == 'selectSkills') {
      // Cleaning up the chat
      ctx.deleteMessage(ctx.callbackQuery.message.message_id);
      ctx.deleteMessage(ctx.callbackQuery.message.message_id - 1);

      var buttons = generateSkillsList();
      ctx.reply(
        `Выберите категории, _на которых Вы специализируетесь_.`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: buttons
          }
        }
      )
    }
  });

  bot.launch();
}


module.exports = startBot;