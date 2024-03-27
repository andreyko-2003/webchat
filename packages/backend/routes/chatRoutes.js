const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  createChat,
  getMyChats,
  createGroupChat,
  renameGroupChat,
  addUserToGroupChat,
  deleteUserFromGroupChat,
} = require("../controllers/chatController");

const router = express.Router();

router.post("/", protect, createChat);
router.get("/", protect, getMyChats);

router.post("/group", protect, createGroupChat);
router.put("/group/rename", protect, renameGroupChat);
router.put("/group/user/add", protect, addUserToGroupChat);
router.put("/group/user/delete", protect, deleteUserFromGroupChat);

module.exports = router;
