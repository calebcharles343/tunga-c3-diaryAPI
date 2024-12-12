const User = require("../models/User.js");
const { hashPassword, verifyPassword } = require("../utils/auth.js");
const catchAsync = require("../utils/catchAsync.js");
const createSendToken = require("../utils/createSendToken.js");
const handleResponse = require("../utils/handleResponse.js");

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

  // 1) Check if email and password exist
  if (!email || !password) {
    handleResponse(res, 401, "Invalid credentials");
  }
  // 2) Check if user exists && password is correct

  const user = await User.findOne({ email: email }).select("+password");

  // console.log(user);
  if (!user) {
    handleResponse(res, 401, "Invalid credentials");
  }

  // // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});
//logout will mostly implemented on the client side with local storage
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
