const User = require("../models/User");

/**
 * ? Check on existing user. Add new if don't exist.
 */
const userCreateMiddleware = async (ctx, next) => {
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
  await next();
};

module.exports = { userCreateMiddleware };
