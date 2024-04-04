const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");

const connectDB = require("./configs/bd");

const userRouter = require("./routes/userRoutes");
const messageRouter = require("./routes/messageRoutes");
const chatRouter = require("./routes/chatRoutes");

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

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stopTyping", (room) => socket.in(room).emit("stopTyping"));

  socket.on("send", (message) => {
    const chat = message.chat;

    if (!chat.users) return console.log("No chat users");

    chat.users.forEach((user) => {
      if (user._id == message.sender._id) return;
      socket.in(user._id).emit("recieved", message);
    });
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});
