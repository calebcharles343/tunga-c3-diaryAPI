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

router.get("/entries/:userId", protect, getAllEntries);
router.get("/entry/:entryId", protect, getEntry);
router.post("/create/:userId", protect, createEntry);
router.put("/update/:entryId", protect, updateEntry);
router.delete("/delete/:entryId", protect, deleteEntry);

// router.get("/:userId/entries/:entryId", getAllTasks);
// router.post("/:userId/entries", createTask);
// router.put("/:userId/entries/:entryId", updateTask);
// router.delete("/:userId/entries/:entryId", deleteTask);

module.exports = router;
