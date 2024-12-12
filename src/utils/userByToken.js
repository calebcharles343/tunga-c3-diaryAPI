const { promisify } = require("util");
const handleResponse = require("../middleware/handleResponse");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const userByToken = async (token) => {
  if (!token) {
    return handleResponse(res, 401, "Invalid Token");
  }

  // 2) Verifying the token
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return handleResponse(res, 401, "Token verification failed");
  }

  // 3) Checking if the user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return handleResponse(res, 401, "User no longer exists");
  }

  return currentUser;
};

module.exports = userByToken;
