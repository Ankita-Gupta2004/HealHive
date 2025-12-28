import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true }, // Firebase UID

    fullName: String,
    age: Number,
    gender: String,
    email: String,
    phone: String,

    address: String,
    city: String,
    state: String,
    pincode: String,

    qualification: String,
    experience: Number,
    specialty: String,
    consultationFee: Number,

    availableDays: [String],
    availableTimeSlots: String,
    languages: String,
    additionalNotes: String,

    // Patients who selected/consulted this doctor
    interestedPatients: [
      {
        uid: String,
        name: String,
        email: String,
        addedAt: { type: Date, default: Date.now },
      },
    ],

    verified: { type: Boolean, default: false },
    profileCompleted: { type: Boolean, default: false }, // Track if doctor completed registration form
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
