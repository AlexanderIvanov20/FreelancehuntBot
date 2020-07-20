require('dotenv').config();

module.exports = {
  PORT: 3000,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  BOT_TOKEN: process.env.FreelancehuntBot,
  ACCESS_KEY: process.env.FreelancehuntToken,
};
