import express from "express";
import { v4 as uuidv4 } from "uuid";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Dummy payment initiation: returns a consultationId for chat
router.post("/initiate", verifyToken, async (req, res) => {
  try {
    const { doctorId, doctorName, slotTime, fee } = req.body || {};
    if (!doctorId || !slotTime) {
      return res.status(400).json({ error: "doctorId and slotTime are required" });
    }

    // Generate a consultation session id
    const consultationId = uuidv4();

    // For real flow: persist payment intent + consultation record in DB
    // Here, we simply return success for dummy payment
    return res.status(200).json({
      success: true,
      message: "Dummy payment approved",
      consultationId,
      doctorId,
      doctorName,
      slotTime,
      fee,
    });
  } catch (err) {
    console.error("Payment error:", err);
    return res.status(500).json({ error: "Payment initiation failed" });
  }
});

export default router;