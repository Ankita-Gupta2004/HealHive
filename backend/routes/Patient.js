import express from "express";
import Patient from "../models/Patient.js";
import User from "../models/User.js"; // 👈 ADD THIS IMPORT
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/submit", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user.uid;

    // 1. Save or Update Patient Info
    const patient = await Patient.findOneAndUpdate(
      { uid },
      { ...req.body, uid },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    // 2. 🔑 THE MISSING LINK: Update the User's profileCompleted status
    await User.findOneAndUpdate(
      { uid }, 
      { profileCompleted: true }
    );

    res.status(200).json({
      success: true,
      message: "Patient data saved and profile marked as completed",
      patient,
    });
  } catch (err) {
    console.error("FULL ERROR:", err); // 👈 This prints to your VS Code / Terminal console
    res.status(500).json({ message: err.message }); // 👈 This sends the REAL error to your browser
}
});

export default router;