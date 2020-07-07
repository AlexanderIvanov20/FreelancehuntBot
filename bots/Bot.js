const { Telegraf } = require('telegraf');
const { start } = require('repl');

const token = process.env.FREELANCEHUNT_TOKEN;
const bot = new Telegraf(token);

const startBot = () => {
  bot.start((ctx) => {
    ctx.reply(`Hello, ${ctx.chat.first_name} ${ctx.chat.last_name}`);
  });

  bot.launch();
}

module.exports = startBot;