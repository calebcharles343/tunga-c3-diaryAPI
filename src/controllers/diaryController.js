const DiaryEntry = require("../models/DiaryEntry.js");
const catchAsync = require("../utils/catchAsync.js");
const filterObj = require("../utils/filterObj.js");
const handleResponse = require("../middleware/handleResponse.js");
const userByToken = require("../middleware/userByToken.js");

const getAllEntries = catchAsync(async (req, res, next) => {
  const currentUser = await userByToken(req, res);

  if (!currentUser) {
    return handleResponse(res, 401, "user not found");
  }

  const entries = await DiaryEntry.find({ user: currentUser.id });
  return handleResponse(res, 200, "Successful", entries);
});

const getEntry = catchAsync(async (req, res, next) => {
  const currentUser = await userByToken(req, res);

  if (!currentUser) {
    return handleResponse(res, 401, "user not found");
  }

  const entryId = req.params.entryId;
  const userId = currentUser.id;

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
  const currentUser = await userByToken(req, res);
  if (!currentUser) {
    return handleResponse(res, 401, "user not found");
  }

  const { title, content } = req.body;

  if (!title || !content) {
    return handleResponse(res, 400, "Please provide both title and content");
  }

  const filteredBody = filterObj(req.body, "title", "content");
  const userId = currentUser.id;

  const entry = new DiaryEntry({
    title: filteredBody.title,
    content: filteredBody.content,
    user: userId,
  });

  await entry.save();
  return handleResponse(res, 201, "Entry Created", entry);
});

const updateEntry = catchAsync(async (req, res, next) => {
  const currentUser = await userByToken(req, res);

  if (!currentUser) {
    return handleResponse(res, 401, "user not found");
  }

  const { title, content } = req.body;

  const entryId = req.params.entryId;
  const userId = currentUser.id;

  if (!entryId) {
    return handleResponse(res, 400, "Please provide an entry ID");
  }

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
  const currentUser = await userByToken(req, res);

  if (!currentUser) {
    return handleResponse(res, 401, "user not found");
  }

  const entryId = req.params.entryId;
  const userId = currentUser.id;

  if (!entryId) {
    return handleResponse(res, 400, "Please provide an entry ID");
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
