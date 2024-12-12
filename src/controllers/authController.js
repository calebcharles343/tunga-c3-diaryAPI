const User = require("../models/User.js");
const { hashPassword, verifyPassword } = require("../utils/auth.js");
const catchAsync = require("../utils/catchAsync.js");
const createSendToken = require("../middleware/createSendToken.js");
const handleResponse = require("../middleware/handleResponse.js");

const seedUsers = async (req, res) => {
  try {
    const users = [
      "ubongclouds@gmail.com",
      "bagampangeronald@gmail.com",
      "cliffbitta@gmail.com",
      "calebcharles343@gmail.com",
      "puduka.douglas@gmail.com",
      "isaacssebaana@gmail.com",
      "isaacngabirano1@gmail.com",
      "taiyesuleiman09@gmail.com",
      "ezenwathecla90@gmail.com",
      "tracy.akapo@gmail.com",
      "ucheokeke61@gmail.com",
      "weliledlamini575@gmail.com",
    ];

    const password = await hashPassword("tunga123");

    for (const email of users) {
      await User.findOneAndUpdate(
        { email },
        { email, password },
        { upsert: true }
      );
    }

    handleResponse(res, 201, "Users seeded successfully");
  } catch (error) {
    handleResponse(res, 500, "Error seeding users");
  }
};

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return handleResponse(res, 400, "Please provide both email and password");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return handleResponse(res, 401, "Invalid credentials");
  }

  const isPasswordCorrect = await verifyPassword(password, user.password); // Compare plain text with stored hash
  if (!isPasswordCorrect) {
    return handleResponse(res, 401, "Invalid credentials");
  }

  4;
  createSendToken(user, 200, res);
});

const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000),
  });
  handleResponse(res, 200, "Logged out successfully");
};

module.exports = {
  seedUsers,
  login,
  logout,
};
