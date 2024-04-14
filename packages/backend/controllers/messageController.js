const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const Notification = require("../models/notificationModel");

const sendMessage = async (req, res) => {
  const { chatId, content, attachments } = req.body;

  if (!chatId || (!content.trim() && attachments.length === 0)) {
    return res.status(400).json({ error: "Invalid data sent" });
  }

  try {
    const newMessage = await Message.create({
      sender: req.user._id,
      text: content,
      chat: chatId,
      attachments: attachments,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "avatar firstName lastName")
      .lean();

    const chat = await Chat.findById(chatId).lean();

    if (chat && chat.users) {
      populatedMessage.chat = {
        _id: chat._id,
        users: chat.users.map((user) => ({
          _id: user._id,
        })),
        groupAdmins: chat.groupAdmins.map((admin) => ({
          _id: admin._id,
        })),
        isGroupChat: chat.isGroupChat,
      };
    }

    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });

    for (const user of [...chat.users, ...chat.groupAdmins]) {
      if (user._id.toString() !== req.user._id.toString()) {
        await Notification.create({
          message: newMessage._id,
          user: user._id,
          chat: chat._id,
        });
      }
    }

    return res.status(200).json(populatedMessage);
  } catch (error) {
    return res.status(400).json({ error: `Error sending message: ${error}` });
  }
};

const updateMessage = async (messageId, updatedContent, attachments) => {
  if (!messageId || (!updatedContent.trim() && attachments.length === 0)) {
    return res.status(400).json({ error: "Invalid data sent" });
  }

  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { text: updatedContent, attachments: attachments },
      { new: true }
    ).populate("sender", "avatar firstName lastName");

    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }
    return updatedMessage;
  } catch (error) {
    console.error(`Error updating message: ${error}`);
  }
};

const updateMessageStatus = async (messageId, status, userId) => {
  try {
    const message = await Message.findByIdAndUpdate(messageId, { status });
    status === "read" &&
      userId &&
      deleteNotification(messageId, message.chat, userId);
  } catch (error) {
    console.error("Error updating message status:", error);
  }
};

const deleteNotification = async (messageId, chatId, userId) => {
  try {
    await Notification.deleteMany({
      message: messageId,
      user: userId,
      chat: chatId,
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
  }
};

const deleteMessage = async (messageId) => {
  try {
    await Message.findByIdAndDelete(messageId);
  } catch (error) {
    console.error("Error deleting message:", error);
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

const getNotificationMessages = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id });

    const messageIds = notifications.map(
      (notification) => notification.message
    );

    const messages = await Message.find({ _id: { $in: messageIds } })
      .populate("sender", "firstName lastName avatar email")
      .populate("chat");

    return res.json(messages);
  } catch (error) {
    return res.status(400).json({ error: `Error getting messages: ${error}` });
  }
};

module.exports = {
  sendMessage,
  updateMessage,
  updateMessageStatus,
  getAllMessages,
  deleteMessage,
  getNotificationMessages,
};
