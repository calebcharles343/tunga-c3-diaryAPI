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

router.get("/entries", protect, getAllEntries);
router.get("/entry/:entryId", protect, getEntry);
router.post("/create", protect, createEntry);
router.put("/update/:entryId", protect, updateEntry);
router.delete("/delete/:entryId", protect, deleteEntry);

module.exports = router;
