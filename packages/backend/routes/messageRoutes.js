const express = require("express");
const {
  sendMessage,
  updateMessage,
  getAllMessages,
} = require("../controllers/messageController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, sendMessage);
router.put("/:messageId", protect, updateMessage);
router.get("/:chatId", protect, getAllMessages);

module.exports = router;
