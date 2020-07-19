/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
const mongoose = require('mongoose');
const Project = require('./models/Project');
const { DB_PASSWORD } = require('./config/config');

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

/**
 * ? Initialize class of tracking project.
 */
class Tracker {
  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * ? Getting current projects and sending it to user.
   */
  async sendProject(userIds) {
    Project.find({}, (err, res) => {
      if (err) throw new Error(err);

      for (let item = 0; item < res.length; item += 1) {
        const ids = res[item].skill_ids;
        const realAmount = (res[item].amount !== -1) ? res[item].amount : 'Договорная';
        // const formatedDate = `${res[item].publish_date}`

        let point = false;
        ids.forEach((element) => {
          if (userIds.includes(element)) {
            point = true;
          }
        });

        if (point) {
          this.ctx.reply(
            `<b><a href="${res[item].link}">${res[item].name}</a></b>\n\n`
            + `${res[item].description.trim()}\n\n`
            + `Цена: <i>${realAmount} ${res[item].currency}</i>\n`
            + `Заказчик: <a href="${res[item].customer_link}">${res[item].customer_first_name} ${res[item].customer_last_name}</a>\n\n`
            + `Дата публикации: ${res[item].publish_date}`,
            {
              parse_mode: 'HTML',
              disable_web_page_preview: true,
            },
          );
        }
      }
    });
  }
}

module.exports = { Tracker };
