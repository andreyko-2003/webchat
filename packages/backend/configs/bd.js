const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      "mongodb+srv://zipz201iayu:15092003Andrew@cluster.a5llrgx.mongodb.net/"
    );
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

module.exports = connectDB;
