const { Telegraf } = require('telegraf');
const { BOT_TOKEN } = require('../config/config');
const Project = require('../models/Project');

const bot = new Telegraf(BOT_TOKEN);

const startBot = () => {
  bot.start((ctx) => {
    var project = new Project({
      title: "TestTitle",
      projectId: 1234
    })
    project.save();
    console.log(project);

    ctx.reply(`Hello, ${ctx.chat.first_name} ${ctx.chat.last_name}`);
  });

  bot.launch();
}

module.exports = startBot;