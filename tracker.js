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

class Tracker {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async sendProject(userIds) {
    Project.find({}, (err, res) => {
      if (err) throw new Error(err);

      for (let item = 0; item < res.length; item += 1) {
        const ids = res[item].skill_ids;

        ids.forEach((element) => {
          if (userIds.includes(element)) {
            this.ctx.reply(
              'Хуёк',
            );
          }
        });
      }
    });
  }
}

module.exports = {
  Tracker,
};

// const track = new Tracker('some');
// track.sendProject([99]);
