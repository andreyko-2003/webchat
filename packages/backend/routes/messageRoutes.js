const express = require("express");
const {
  sendMessage,
  getAllMessages,
  getNotificationMessages,
} = require("../controllers/messageController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/notif", protect, getNotificationMessages);
router.get("/:chatId", protect, getAllMessages);

module.exports = router;
