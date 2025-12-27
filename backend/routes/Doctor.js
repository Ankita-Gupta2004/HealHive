import express from "express";
import Doctor from "../models/Doctor.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * POST: Register Doctor
 */
router.post("/submit", verifyToken, async (req, res) => {
  try {
    // CHANGE THIS LINE:
    const uid = req.firebaseUser.uid; 

    // prevent duplicate doctor
    const existingDoctor = await Doctor.findOne({ uid });
    if (existingDoctor) {
      return res.status(400).json({
        message: "Doctor already registered",
      });
    }

    const doctor = new Doctor({
      uid,
      ...req.body,
    });

    await doctor.save();

    res.status(201).json({
      message: "Doctor registered successfully",
      doctor,
    });
  } catch (error) {
    console.error("Doctor submit error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
