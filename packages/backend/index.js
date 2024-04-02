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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
