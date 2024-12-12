const express = require("express");
const {
  seedUsers,
  login,
  logout,
} = require("../controllers/authController.js");

const router = express.Router();

router.post("/seed", seedUsers);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
