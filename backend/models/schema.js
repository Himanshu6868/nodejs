const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Data", userSchema);
