const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const createChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "UserId wasn't sent" });
  }

  try {
    const existingChat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);
    const chat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );

    return res.status(200).json(chat);
  } catch (err) {
    console.error("Error creating chat:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage");

    if (!chats || chats.length === 0) {
      return res.json([]);
    }

    const results = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "firstName lastName avatar email",
    });

    return res.json(results);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createGroupChat = async (req, res) => {
  const { title, description, avatar, users } = req.body;

  if (!users || !title) {
    return res
      .status(400)
      .json({
        error: "Invalid request parameters. Users and title are required.",
      });
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: title,
      chatDescription: description,
      avatar: avatar,
      users: users,
      isGroupChat: true,
      groupChat: req.user,
    });

    const groupChatData = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json(groupChatData);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const renameGroupChat = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return res.status(404);
  } else {
    return res.json(updatedChat);
  }
};

const addUserToGroupChat = async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!chat) {
    return res.status(404);
  } else {
    return res.json(chat);
  }
};

const deleteUserFromGroupChat = async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!chat) {
    return res.status(404);
  } else {
    return res.json(chat);
  }
};

module.exports = {
  createChat,
  getMyChats,
  createGroupChat,
  renameGroupChat,
  addUserToGroupChat,
  deleteUserFromGroupChat,
};
