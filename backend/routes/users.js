import express from "express";
import User from "../models/User.js";
import { admin } from "../firebaseAdmin.js";

const router = express.Router();

// Sync user from Firebase to MongoDB
router.post("/sync", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send("No token provided");

    const token = authHeader.split(" ")[1];
const decodedToken = await admin.auth.verifyIdToken(token);
    const { role, extra } = req.body;

    // 🔑 Check if user already exists
    let user = await User.findOne({ uid: decodedToken.uid });

    // 🆕 First-time user → role REQUIRED
    if (!user) {
      if (!role || !["patient", "doctor"].includes(role)) {
        return res.status(400).json({ error: "Role required for new users" });
      }

      // Inside router.post("/sync", ...)
      user = await User.create({
        uid: decodedToken.uid,
        email: decodedToken.email,
        // Check the token first, then the request body, then a fallback string
        displayName: decodedToken.name || extra?.name || "New User",
        role,
        provider: "password",
        metadata: { ...extra, emailVerified: decodedToken.email_verified },
        profileCompleted: false,
        lastSeen: new Date(),
      });
    }
    // 🔁 Existing user → NO role change
    else {
      user.lastSeen = new Date();
      await user.save();
    }

    res.json(user);
  } catch (err) {
    console.error("Sync route error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get logged-in user role (for login redirect)
router.post("/login", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send("No token provided");

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth.verifyIdToken(token);

    const user = await User.findOne({ uid: decodedToken.uid });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      role: user.role,
      profileCompleted: user.profileCompleted,
    });
  } catch (err) {
    console.error("Login route error:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
