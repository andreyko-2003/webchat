const getToken = require("../configs/getToken");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const signUp = async (req, res) => {
  const { firstName, lastName, avatar, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "Some fields are empty" });
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    return res
      .status(400)
      .json({ error: "User with this email already exist" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    avatar,
    email,
    password: hashedPassword,
  });

  if (user) {
    const data = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
    };
    return res.status(201).json({ ...data, token: getToken(data) });
  } else {
    return res.status(400).json({ error: "Failed to register user" });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const data = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
    };
    res.json({ ...data, token: getToken(data) });
  } else {
    return res.status(401).json({ error: "Invalid email or password" });
  }
};

const search = async (req, res) => {
  const search = req.params.search
    ? {
        $or: [
          { firstName: { $regex: req.params.search, $options: "i" } },
          { lastName: { $regex: req.params.search, $options: "i" } },
          { email: { $regex: req.params.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(search).find({ _id: { $ne: req.user._id } });
  res.send(users);
};

const getMe = async (req, res) => {
  const user = req.user;

  if (!user) return res.status("401");

  return res.json(user);
};

const updateMe = async (req, res) => {
  const { firstName, lastName, email, avatar } = req.body;
  const { _id } = req.user;
  try {
    const user = await User.findByIdAndUpdate(_id, {
      firstName,
      lastName,
      email,
      avatar,
    });
    const data = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
    };
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: `Error updating user: ${error}` });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    if (user && (await bcrypt.compare(oldPassword, user.password))) {
      await User.findByIdAndUpdate(_id, {
        password: await bcrypt.hash(newPassword, 10),
      });
      const data = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
      };
      return res.status(200).json(data);
    }
    return res.status(400).json({ error: "Old password is incorrect" });
  } catch (error) {
    return res.status(500).json({ error: `Error changing password: ${error}` });
  }
};

const updateUserStatus = async (userId, status) => {
  if (status === "online")
    await User.findByIdAndUpdate(userId, { status: status });
  else if (status === "offline")
    await User.findByIdAndUpdate(userId, {
      status: status,
      latestActivity: new Date(),
    });
};

module.exports = {
  signUp,
  signIn,
  search,
  getMe,
  updateMe,
  changePassword,
  updateUserStatus,
};
