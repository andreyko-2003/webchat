const Chat = require("../models/chatModel");

const createChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.send(400).json({ error: "UserId wasn`t send" });
  }

  const chats = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { elemMatch: { $eq: req.user._id } } },
      { users: { elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMesage");

  const userChats = await User.populate(chats, {
    path: "latesMessage.sender",
    select: "firstName lastName avatar email",
  });

  if (userChats.length > 0) {
    res.send(userChats[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createChat = await Chat.create(chatData);
      const chat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );

      return res.status(200).json(chat);
    } catch (err) {
      return res.status(500);
    }
  }
};

const getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage");

    const results = await User.populate(chats, {
      path: "latesMessage.sender",
      select: "firstName lastName avatar email",
    });

    return res.json(results);
  } catch {
    return res.status(500);
  }
};

const createGroupChat = async (req, res) => {
  const { name } = req.body;
  const users = JSON.parse(req.body.users);

  if (!users || !name) {
    return res.status(400);
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: name,
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
