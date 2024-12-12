const DiaryEntry = require("../models/DairyEntry.js");
const catchAsync = require("../utils/catchAsync.js");
const filterObj = require("../utils/filterObj.js");
const handleResponse = require("../middleware/handleResponse.js");

const getAllEntries = catchAsync(async (req, res, next) => {
  const userid = req.params.id;

  const entries = await DiaryEntry.find({ user: userid });
  return handleResponse(res, 200, "Successful", entries);
});

const getEntry = catchAsync(async (req, res, next) => {
  const userid = req.headers["userId"] || req.user._id;
  const entryId = req.params.id;

  if (!userid || !entryId) {
    return handleResponse(res, 404, "Please Provide both user and entry IDs");
  }

  const entry = await DiaryEntry.findOne({
    _id: entryId,
    user: userid,
  });

  if (!entry) {
    return handleResponse(res, 404, "Entry not found");
  }

  return handleResponse(res, 200, "Successful", entry);
});

const createEntry = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;

  const userId = req.params.id;

  if (!title || !content) {
    return handleResponse(res, 404, "please provide both title and content");
  }
  const filteredBody = filterObj(req.body, "title", "content");

  const entry = new DiaryEntry({
    title: filteredBody.title,
    content: filteredBody.content,
    user: userId,
  });

  await entry.save();
  return handleResponse(res, 201, "Entry Created", entry);
});

const updateEntry = catchAsync(async (req, res, next) => {
  const id = req.headers["userId"] || req.user._id;
  const { title, content } = req.body;

  if (!title || !content) {
    return handleResponse(res, 404, "please provide both title and content");
  }

  const filteredBody = filterObj(req.body, "title", "content");

  const entry = await DiaryEntry.findOneAndUpdate(
    { _id: req.params.id, user: id },
    { title: filteredBody.title, content: filteredBody.content },
    { new: true }
  );

  if (!entry) {
    return handleResponse(res, 404, "Entry not found");
  }

  return handleResponse(res, 200, "Entry updated", entry);
});

const deleteEntry = catchAsync(async (req, res, next) => {
  const userid = req.headers["userId"] || req.user._id;
  const entryId = req.params.id;

  const entry = await DiaryEntry.findOneAndDelete({
    _id: entryId,
    user: userid,
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
