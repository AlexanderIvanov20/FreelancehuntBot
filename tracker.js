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

  sendProject(userIds) {
    Project.find({}, (err, res) => {
      
    });
  }
}

const track = new Tracker('some');
track.sendProject();
