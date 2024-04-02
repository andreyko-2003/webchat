const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;

  if (!chatId || !content) {
    return res.status(400).json({ error: "Invalid data sent" });
  }

  try {
    const newMessage = await Message.create({
      sender: req.user._id,
      text: content,
      chat: chatId,
    });

    await newMessage.populate("sender", "avatar firstName lastName");

    const populatedMessage = await User.populate(newMessage, {
      path: "chat.users",
      select: "firstName lastName email avatar",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: populatedMessage });

    return res.status(200).json(populatedMessage);
  } catch (error) {
    return res.status(400).json({ error: `Error sending message: ${error}` });
  }
};

const updateMessage = async (req, res) => {
  const { updatedContent } = req.body;
  const { messageId } = req.params;

  if (!messageId || !updatedContent) {
    return res.status(400).json({ error: "Invalid data sent" });
  }

  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { text: updatedContent },
      { new: true }
    ).populate("sender", "avatar firstName lastName");

    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    return res.status(200).json(updatedMessage);
  } catch (error) {
    return res.status(400).json({ error: `Error updating message: ${error}` });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "firstName lastName avatar email")
      .populate("chat");

    return res.json(messages);
  } catch (error) {
    return res.status(400).json({ error: `Error getting messages: ${error}` });
  }
};

module.exports = { sendMessage, updateMessage, getAllMessages };
