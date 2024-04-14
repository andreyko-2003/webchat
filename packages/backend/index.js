const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const path = require("path");

const connectDB = require("./configs/bd");

const userRouter = require("./routes/userRoutes");
const messageRouter = require("./routes/messageRoutes");
const chatRouter = require("./routes/chatRoutes");
const { updateUserStatus } = require("./controllers/userController");
const {
  updateMessageStatus,
  updateMessageText,
  deleteMessage,
} = require("./controllers/messageController");

connectDB();
const app = express();

const port = 5000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res
    .status(200)
    .json({ filename: file.filename, url: `/uploads/${file.filename}` });
});

app.use("/uploads", express.static("uploads"));

app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

const userStatuses = {};

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
    socket.userId = userData._id;
    updateUserStatus(userData._id, "online");
    userStatuses[userData._id] = { status: "online" };
    io.emit("userStatus", userStatuses);
  });

  socket.on("join", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing", room));
  socket.on("stopTyping", (room) => socket.in(room).emit("stopTyping", room));

  socket.on("send", (message) => {
    const chat = message.chat;

    const users = chat.isGroupChat
      ? chat.groupAdmins.concat(chat.users)
      : chat.users;

    if (!users || users.length === 0) return console.log("No chat users");

    users.forEach((user) => {
      if (user._id == message.sender._id) return;
      socket.in(user._id).emit("received", message);
    });
  });

  socket.on("editMessage", ({ editMessageId, updatedMessage }) => {
    updateMessageText(editMessageId, updatedMessage);
    io.emit("messageEdited", { _id: editMessageId, text: updatedMessage });
  });

  socket.on("deleteMessage", (messageId) => {
    deleteMessage(messageId);
    io.emit("messageDeleted", messageId);
  });

  socket.on("markAsSent", async (messageId) => {
    updateMessageStatus(messageId, "sent");
    io.emit("messageStatusUpdate", { messageId, status: "sent" });
  });

  socket.on("markAsRead", async ({ messageId, userId }) => {
    updateMessageStatus(messageId, "read", userId);
    io.emit("messageStatusUpdate", { messageId, status: "read" });
  });

  socket.on("disconnect", () => {
    const userId = socket.userId;
    if (userId) {
      updateUserStatus(userId, "offline");
      userStatuses[userId] = { status: "offline", latestActivity: new Date() };
      io.emit("userStatus", userStatuses);
    }
  });

  socket.on("logout", (userId) => {
    updateUserStatus(userId, "offline");
    userStatuses[userId] = { status: "offline", latestActivity: new Date() };
    io.emit("userStatus", userStatuses);
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});
