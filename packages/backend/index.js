const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");

const connectDB = require("./configs/bd");

const userRouter = require("./routes/userRoutes");
const messageRouter = require("./routes/messageRoutes");
const chatRouter = require("./routes/chatRoutes");
const { updateUserStatus } = require("./controllers/userController");
const Message = require("./models/messageModel");
const {
  updateMessage,
  updateMessageStatus,
} = require("./controllers/messageController");

connectDB();
const app = express();

const port = 5000;

app.use(cors());
app.use(bodyParser.json());

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

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stopTyping", (room) => socket.in(room).emit("stopTyping"));

  socket.on("send", (message) => {
    const chat = message.chat;

    const users = chat.isGroupChat
      ? chat.groupAdmins.concat(chat.users)
      : chat.users;

    if (!users) return console.log("No chat users");

    users.forEach((user) => {
      if (user._id == message.sender._id) return;
      socket.in(user._id).emit("recieved", message);
    });
  });

  socket.on("markAsSent", async (messageId) => {
    updateMessageStatus(messageId, "sent");
    io.emit("messageStatusUpdate", { messageId, status: "sent" });
  });

  socket.on("markAsRead", async (messageId) => {
    updateMessageStatus(messageId, "read");
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
