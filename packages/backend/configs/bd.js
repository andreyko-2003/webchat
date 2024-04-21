const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_PATH);
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

module.exports = connectDB;
