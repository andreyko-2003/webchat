const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

const getToken = (data) => {
  return jwt.sign(data, secretKey, { expiresIn: "12h" });
};

module.exports = getToken;
