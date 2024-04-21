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
    let chats = await Chat.find({
      $or: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { groupAdmins: { $elemMatch: { $eq: req.user._id } } },
      ],
    })
      .populate("users", "-password")
      .populate("groupAdmins", "-password")
      .populate("latestMessage")
      .sort({ "latestMessage.createdAt": -1, createdAt: -1 });

    if (!chats || chats.length === 0) {
      return res.json([]);
    }

    let results = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "firstName lastName avatar email",
    });

    results = results.sort((a, b) => {
      const dateA = a.latestMessage ? a.latestMessage.createdAt : a.createdAt;
      const dateB = b.latestMessage ? b.latestMessage.createdAt : b.createdAt;
      return new Date(dateB) - new Date(dateA);
    });

    return res.json(results);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createGroupChat = async (req, res) => {
  const { title, description, avatar, users, groupAdmins } = req.body;

  if (!users || !title) {
    return res.status(400).json({
      error: "Invalid request parameters. Users and title are required.",
    });
  }

  try {
    const groupChat = await Chat.create({
      chatName: title,
      chatDescription: description,
      avatar: avatar,
      users: users,
      isGroupChat: true,
      groupAdmins: groupAdmins,
    });

    const groupChatData = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmins", "-password");

    return res.status(200).json(groupChatData);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const updateGroupChat = async (req, res) => {
  const { chatId, title, description, avatar, users, groupAdmins } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: title,
      chatDescription: description,
      avatar,
      users,
      groupAdmins,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmins", "-password");

  if (!updatedChat) {
    return res.status(404).send("Chat not found");
  } else {
    return res.json(updatedChat);
  }
};

const leaveGroupChat = async (req, res) => {
  const { chatId } = req.body;
  const userId = req.user._id;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const isUserMember = chat.users.some((user) => user.equals(userId));
    const isUserAdmin = chat.groupAdmins.some((admin) => admin.equals(userId));

    if (!isUserMember && !isUserAdmin) {
      return res
        .status(403)
        .json({ error: "User is not a member of the chat" });
    }

    if (isUserMember) {
      chat.users.pull(userId);
    }

    if (isUserAdmin) {
      chat.groupAdmins.pull(userId);
    }

    await chat.save();

    return res.status(200).json({ message: "User left the chat successfully" });
  } catch (error) {
    console.error("Error leaving chat:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteChat = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user._id;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const isGroupChat = chat.isGroupChat;
    const isUserInChat = chat.users.some((user) => user.equals(userId));

    if (!isUserInChat && !isGroupChat) {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this chat" });
    }

    if (isGroupChat && chat.groupAdmins.length > 0) {
      const isAdmin = chat.groupAdmins.some((admin) => admin.equals(userId));
      if (!isAdmin) {
        return res
          .status(403)
          .json({ error: "You do not have permission to delete this chat" });
      }
    }

    await Chat.findByIdAndDelete(chatId);

    return res
      .status(200)
      .json({ message: "Chat deleted successfully", _id: chatId });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createChat,
  getMyChats,
  createGroupChat,
  updateGroupChat,
  leaveGroupChat,
  deleteChat,
};
