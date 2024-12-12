const DiaryEntry = require("../models/DairyEntry.js");
const catchAsync = require("../utils/catchAsync.js");
const filterObj = require("../utils/filterObj.js");
const handleResponse = require("../middleware/handleResponse.js");
const userByToken = require("../utils/userByToken.js");

const getAllEntries = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return handleResponse(res, 401, "Invalid Token");
  }
  const cunrrentUser = await userByToken(token);

  if (!cunrrentUser) {
    return handleResponse(res, 401, "user not found");
  }

  // const userId = cunrrentUser.id;

  const entries = await DiaryEntry.find({ user: cunrrentUser.id });
  return handleResponse(res, 200, "Successful", entries);
});

const getEntry = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return handleResponse(res, 401, "Invalid Token");
  }
  const cunrrentUser = await userByToken(token);

  if (!cunrrentUser) {
    return handleResponse(res, 401, "user not found");
  }

  const entryId = req.params.entryId;
  const userId = cunrrentUser.id;
  console.log(entryId, userId);

  if (!entryId) {
    return handleResponse(res, 400, "Please provide an entry ID");
  }

  const entry = await DiaryEntry.findOne({
    _id: entryId,
    user: userId,
  });

  if (!entry) {
    return handleResponse(res, 404, "Entry not found");
  }

  return handleResponse(res, 200, "Successful", entry);
});

const createEntry = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return handleResponse(res, 400, "Please provide both title and content");
  }

  const filteredBody = filterObj(req.body, "title", "content");
  const userId = req.params.userId;

  const entry = new DiaryEntry({
    title: filteredBody.title,
    content: filteredBody.content,
    user: userId,
  });

  await entry.save();
  return handleResponse(res, 201, "Entry Created", entry);
});

const updateEntry = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return handleResponse(res, 401, "Invalid Token");
  }
  const cunrrentUser = await userByToken(token);

  if (!cunrrentUser) {
    return handleResponse(res, 401, "user not found");
  }

  if (!entryId) {
    return handleResponse(res, 400, "Please provide an entry ID");
  }

  const entryId = req.params.entryId;
  const userId = cunrrentUser.id;

  if (!title || !content) {
    return handleResponse(res, 400, "Please provide both title and content");
  }

  const filteredBody = filterObj(req.body, "title", "content");

  const entry = await DiaryEntry.findOneAndUpdate(
    { _id: entryId, user: userId },
    { title: filteredBody.title, content: filteredBody.content },
    { new: true }
  );

  if (!entry) {
    return handleResponse(res, 404, "Entry not found");
  }

  return handleResponse(res, 200, "Entry updated", entry);
});

const deleteEntry = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return handleResponse(res, 401, "Invalid Token");
  }
  const cunrrentUser = await userByToken(token);

  if (!cunrrentUser) {
    return handleResponse(res, 401, "user not found");
  }

  if (!entryId) {
    return handleResponse(res, 400, "Please provide an entry ID");
  }

  const entryId = req.params.entryId;
  const userId = cunrrentUser.id;

  if (!title || !content) {
    return handleResponse(res, 400, "Please provide both title and content");
  }

  const entry = await DiaryEntry.findOneAndDelete({
    _id: entryId,
    user: userId,
  });

  if (!entry) {
    return handleResponse(res, 404, "Entry not found");
  }

  return handleResponse(res, 200, "Entry deleted");
});

module.exports = {
  getAllEntries,
  getEntry,
  createEntry,
  updateEntry,
  deleteEntry,
};
