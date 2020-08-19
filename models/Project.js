const { Schema, model } = require("mongoose");

/* Describe project's schema of the collection */
const schema = new Schema(
  {
    projectId: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
    },
    currency: {
      type: String,
    },
    customer_first_name: {
      type: String,
      required: true,
    },
    customer_last_name: {
      type: String,
    },
    link: {
      type: String,
      required: true,
    },
    skill_ids: {
      type: Array,
      required: true,
    },
    customer_link: {
      type: String,
      required: true,
    },
    publish_date: {
      type: Date,
      required: true,
    },
  },
  { collection: "projects" }
);

module.exports = model("Project", schema);
