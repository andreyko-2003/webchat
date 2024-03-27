const jwt = require("jsonwebtoken");

const secretKey = "Andreyko2003";

const getToken = (data) => {
  return jwt.sign(data, secretKey, { expiresIn: "12h" });
};

module.exports = getToken;
