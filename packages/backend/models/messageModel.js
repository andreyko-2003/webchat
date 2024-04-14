const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: { type: String, trim: true },
    attachments: [{ type: Object }],
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    status: {
      type: String,
      enum: ["sending", "sent", "read"],
      default: "sending",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageModel);

module.exports = Message;
