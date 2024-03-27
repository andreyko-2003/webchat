const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./configs/bd");

const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");

connectDB();
const app = express();

const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRouter);
app.use("/chat", chatRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
