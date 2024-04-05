const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    latestActivity: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userModel);

module.exports = User;
