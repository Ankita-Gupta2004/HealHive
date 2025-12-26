import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  displayName: { type: String, required: true },
  role: { type: String, enum: ["patient", "doctor"], required: true }, // ✅ Added role
  provider: String,
  createdAt: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
  metadata: Object, // optional extra info
});

export default mongoose.model("User", userSchema);
