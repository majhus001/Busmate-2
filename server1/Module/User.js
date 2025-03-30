const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  Username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["User", "Admin"], default: "User" },
  city: { type: String, required: true },
  state: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Check if model already exists to prevent recompilation
const User = mongoose.models.User || mongoose.model("User", UserSchema);
module.exports = User;