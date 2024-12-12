const express = require("express");

const {
  getAllEntries,
  getEntry,
  createEntry,
  updateEntry,
  deleteEntry,
} = require("../controllers/dairyController.js");
const protect = require("../middleware/protect.js");

const router = express.Router();

router.get("/:id", protect, getAllEntries);
router.get("/:id", protect, getEntry);
router.post("/:id", protect, createEntry);
router.put("/:id", protect, updateEntry);
router.delete("/:id", protect, deleteEntry);

module.exports = router;
