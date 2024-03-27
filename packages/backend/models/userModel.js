const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3ADefault_pfp.svg&psig=AOvVaw1kCmHTtC0sxmfCGPAnl7a7&ust=1711549282572000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPi31YyQkoUDFQAAAAAdAAAAABAE",
    },
  },
  { timestamp: true }
);

const User = mongoose.model("User", userModel);

module.exports = User;
