const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
  createChat,
  getMyChats,
  createGroupChat,
  updateGroupChat,
  leaveGroupChat,
  deleteChat,
} = require("../controllers/chatController");

const router = express.Router();

router.post("/", protect, createChat);
router.get("/", protect, getMyChats);
router.delete("/:chatId", protect, deleteChat);
router.post("/group", protect, createGroupChat);
router.put("/group", protect, updateGroupChat);
router.put("/group/leave", protect, leaveGroupChat);

module.exports = router;
