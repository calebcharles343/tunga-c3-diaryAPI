const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.set("toJSON", {
  virtuals: true,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

userSchema.set("toJSON", {
  virtuals: true,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(); // Add `id` field
    delete returnedObject._id; // Remove `_id` field
    delete returnedObject.__v; // Remove `__v` field
  },
});

module.exports = mongoose.model("User", userSchema);
