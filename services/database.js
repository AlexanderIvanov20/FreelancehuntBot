const mongoose = require("mongoose");
const { DB_PASSWORD } = require("../config/config");

/**
 * ? Connect to database.
 */
const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://alexander:${DB_PASSWORD}@cluster0.rkfw4.mongodb.net/freelancehuntBot`,
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = { connectToDatabase };
