import express from 'express';
import Consultation from '../models/Consultation.js';
import Patient from '../models/Patient.js';

const router = express.Router();

// GET /api/consultations/history - Get patient's consultation history
router.get('/history', async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID required',
      });
    }

    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    const consultations = await Consultation.find({
      patientId: patient._id,
    })
    .sort({ date: -1 })
    .lean();

    const formattedConsultations = consultations.map(consult => ({
      id: consult._id,
      doctorName: consult.doctorName,
      doctorSpecialty: consult.doctorSpecialty,
      doctorId: consult.doctorId,
      date: consult.date,
      time: consult.time,
      status: consult.status,
      paymentStatus: consult.paymentStatus,
      fee: consult.consultationFee,
      notes: consult.notes,
      prescription: consult.prescription,
      createdAt: consult.createdAt,
    }));

    res.status(200).json({
      success: true,
      consultations: formattedConsultations,
    });
  } catch (error) {
    console.error('Error fetching consultation history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultation history',
      error: error.message,
    });
  }
});

// GET /api/consultations/:id - Get single consultation
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['user-id'];

    const consultation = await Consultation.findById(id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found',
      });
    }

    const patient = await Patient.findOne({ userId });
    if (!patient || consultation.patientId.toString() !== patient._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    res.status(200).json({
      success: true,
      consultation,
    });
  } catch (error) {
    console.error('Error fetching consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultation',
      error: error.message,
    });
  }
});

// POST /api/consultations/:id/cancel - Cancel consultation
router.post('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['user-id'];

    const consultation = await Consultation.findById(id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found',
      });
    }

    const patient = await Patient.findOne({ userId });
    if (!patient || consultation.patientId.toString() !== patient._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    if (consultation.status !== 'upcoming') {
      return res.status(400).json({
        success: false,
        message: 'Only upcoming consultations can be cancelled',
      });
    }

    consultation.status = 'cancelled';
    consultation.updatedAt = new Date();
    await consultation.save();

    res.status(200).json({
      success: true,
      message: 'Consultation cancelled successfully',
      consultation,
    });
  } catch (error) {
    console.error('Error cancelling consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel consultation',
      error: error.message,
    });
  }
});

export default router;