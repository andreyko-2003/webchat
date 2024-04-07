const express = require("express");
const {
  signUp,
  signIn,
  search,
  getMe,
  updateMe,
  changePassword,
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.put("/password", protect, changePassword);
router.get("/:search", protect, search);

module.exports = router;
