/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
const Project = require('../models/Project');
const { connectToDatabase } = require('./database');

/**
 * ? Connect to database.
 */
connectToDatabase();

/**
 * * Initialize class of tracking project.
 */
class Tracker {
  /**
   * ? Getting current projects and sending it to user.
   *
   * @param {Array} userIds User skills.
   */
  async sendProject(userIds) {
    const finalProjects = [];
    /** Get projects and sort it by date then they were published. */
    await Project.find({}, null, { sort: { publish_date: 1 } }, (err, res1) => {
      if (err) throw new Error(err);

      const res = res1.reverse();
      for (let item = 0; item < res.length; item += 1) {
        const ids = res[item].skill_ids;
        let point = false;
        ids.forEach((element) => {
          if (userIds.includes(element)) {
            point = true;
          }
        });

        if (point) {
          finalProjects.push(res[item]);
        }
      }
    });
    /** Return promise for better async operations */
    return new Promise((resolve) => {
      if (finalProjects.length !== 0) {
        resolve(finalProjects);
      }
    });
  }
}

module.exports = { Tracker };
