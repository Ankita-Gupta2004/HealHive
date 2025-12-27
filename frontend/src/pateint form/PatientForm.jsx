import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";
import Navbar from "../Homepage/Navbar";
import Footer from "../Homepage/footer";
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  AlertCircle,
  Heart,
  CreditCard,
  CheckCircle,
  UserCircle,
} from "lucide-react";

const commonDiseases = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Arthritis",
  "Thyroid Disorder",
  "Kidney Disease",
  "Liver Disease",
  "COPD",
  "Cancer",
  "Migraine",
  "Depression",
  "Anxiety",
  "Other",
];

const specialties = [
  "General Medicine",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Ophthalmology",
  "Gynecology",
  "Pediatrics",
  "Dermatology",
  "ENT",
  "Psychiatry",
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const doctors = [
  {
    id: 1,
    name: "Dr. Arjun Mehta",
    specialty: "Cardiology",
    diseases: ["Hypertension", "Heart Disease"],
    fee: "₹700",
    availability: "Today • 3 slots",
    experience: "12 yrs",
    languages: "English, Hindi",
    timeSlots: [
      { time: "09:00 AM", available: true },
      { time: "11:00 AM", available: false },
      { time: "04:00 PM", available: true },
    ],
  },
  {
    id: 2,
    name: "Dr. Kavya Rao",
    specialty: "General Medicine",
    diseases: ["Diabetes", "Asthma", "COPD", "Thyroid Disorder", "Kidney Disease", "Liver Disease"],
    fee: "₹450",
    availability: "Today • 5 slots",
    experience: "9 yrs",
    languages: "English, Hindi, Telugu",
    timeSlots: [
      { time: "10:00 AM", available: true },
      { time: "02:30 PM", available: true },
      { time: "05:30 PM", available: true },
    ],
  },
  {
    id: 3,
    name: "Dr. Neeraj Sethi",
    specialty: "Neurology",
    diseases: ["Migraine"],
    fee: "₹650",
    availability: "Tomorrow • 4 slots",
    experience: "11 yrs",
    languages: "English, Hindi",
    timeSlots: [
      { time: "09:30 AM", available: false },
      { time: "12:00 PM", available: true },
      { time: "03:30 PM", available: true },
    ],
  },
  {
    id: 4,
    name: "Dr. Rina Mukherjee",
    specialty: "Psychiatry",
    diseases: ["Depression", "Anxiety"],
    fee: "₹600",
    availability: "Today • 2 slots",
    experience: "10 yrs",
    languages: "English, Bengali, Hindi",
    timeSlots: [
      { time: "11:30 AM", available: true },
      { time: "03:00 PM", available: false },
    ],
  },
  {
    id: 5,
    name: "Dr. Sanjay Kulkarni",
    specialty: "Orthopedics",
    diseases: ["Arthritis"],
    fee: "₹550",
    availability: "Tomorrow • 6 slots",
    experience: "13 yrs",
    languages: "English, Marathi, Hindi",
    timeSlots: [
      { time: "10:30 AM", available: true },
      { time: "01:00 PM", available: true },
      { time: "04:30 PM", available: false },
    ],
  },
  {
    id: 6,
    name: "Dr. Meera Shah",
    specialty: "Dermatology",
    diseases: ["Skin Allergy", "Dermatitis", "Eczema"],
    fee: "₹500",
    availability: "Today • 4 slots",
    experience: "8 yrs",
    languages: "English, Gujarati, Hindi",
    timeSlots: [
      { time: "09:00 AM", available: true },
      { time: "02:00 PM", available: false },
      { time: "05:00 PM", available: true },
    ],
  },
];

const PatientForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    bloodGroup: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergencyContact: "",
    emergencyName: "",
    selectedDisease: "",
    otherDisease: "",
    allergies: "",
    currentMedications: "",
    symptoms: "",
    specialty: "",
    preferredDate: "",
    preferredTime: "",
    additionalNotes: "",
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const findSpecialtyForDisease = (disease) => {
    if (!disease) return "General Medicine";
    const lower = disease.toLowerCase();
    const map = {
      hypertension: "Cardiology",
      "heart disease": "Cardiology",
      diabetes: "General Medicine",
      asthma: "General Medicine",
      copd: "General Medicine",
      arthritis: "Orthopedics",
      migraine: "Neurology",
      depression: "Psychiatry",
      anxiety: "Psychiatry",
      "kidney disease": "General Medicine",
      "liver disease": "General Medicine",
      "thyroid disorder": "General Medicine",
      cancer: "General Medicine",
    };
    if (map[lower]) return map[lower];
    if (lower.includes("skin")) return "Dermatology";
    if (lower.includes("ear") || lower.includes("nose") || lower.includes("throat")) return "ENT";
    return "General Medicine";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
      if (!formData.age || formData.age < 1 || formData.age > 120)
        newErrors.age = "Valid age is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        newErrors.email = "Valid email is required";
      if (!formData.phone.match(/^\d{10}$/))
        newErrors.phone = "Valid 10-digit phone number required";
    }

    if (currentStep === 2) {
      if (!formData.selectedDisease)
        newErrors.selectedDisease = "Please select a medical condition";
      if (formData.selectedDisease === "Other" && !formData.otherDisease.trim())
        newErrors.otherDisease = "Please specify the condition";
      if (!formData.symptoms.trim())
        newErrors.symptoms = "Please describe your symptoms";
    }

    if (currentStep === 3) {
      if (!formData.preferredDate)
        newErrors.preferredDate = "Please select a date";
      if (!formData.preferredTime)
        newErrors.preferredTime = "Please select a time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setStep((prev) => prev - 1);
  };

  // Save data without navigating
  const handleSaveOnly = async () => {
    if (!validateStep(step)) return;

    setSaving(true);
    try {
      const token = await user.getIdToken();

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/patient/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(
          `Failed to save patient data: ${res.status} ${res.statusText}. ${errorBody.slice(0, 100)}`
        );
      }

      const data = await res.json();
      console.log("✅ Patient data saved:", data);
      alert("✅ Your information has been saved successfully! You can view it in My Dashboard.");
    } catch (err) {
      console.error("❌ Error:", err);
      alert(`Error saving patient data: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Save data and navigate to available doctors
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      setSaving(true);
      try {
        // Get Firebase token
        const token = await user.getIdToken();

        // Save patient data to backend
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/patient/submit`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          }
        );

        if (!res.ok) {
          const errorBody = await res.text();
          throw new Error(
            `Failed to save patient data: ${res.status} ${res.statusText}. ${errorBody.slice(0, 100)}`
          );
        }

        const data = await res.json();
        console.log("✅ Patient data saved:", data);

        // Now filter doctors and navigate
        const specialtyFocus = formData.specialty || findSpecialtyForDisease(formData.selectedDisease);
        const matches = doctors.filter((doc) => {
          const specialtyMatch = doc.specialty.toLowerCase() === specialtyFocus.toLowerCase();
          const diseaseMatch = formData.selectedDisease
            ? (doc.diseases || []).some(
                (d) => d.toLowerCase() === formData.selectedDisease.toLowerCase()
              )
            : false;
          return specialtyMatch || diseaseMatch;
        });

        const fallbackDocs = doctors.filter((doc) => doc.specialty === "General Medicine");
        const usingFallback = matches.length === 0;
        const doctorsToShow = usingFallback ? fallbackDocs : matches;

        navigate("/available-doctors", {
          state: {
            doctors: doctorsToShow,
            usedFallback: usingFallback,
            targetSpecialty: specialtyFocus,
            selectedDisease: formData.selectedDisease || "General Consultation",
          },
        });
      } catch (err) {
        console.error("❌ Error:", err);
        alert(`Error saving patient data: ${err.message}`);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* Background gradients */}
        <div className="absolute -top-24 -left-24 h-96 w-96 bg-emerald-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-24 h-96 w-96 bg-teal-200/40 rounded-full blur-3xl animate-pulse delay-200" />

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fadeUp">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Stethoscope className="h-8 w-8 text-emerald-600" />
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
              Patient Registration
            </h1>
          </div>
          <p className="text-slate-600">
            Fill in your details to book a telehealth consultation
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, label: "Personal Info", icon: User },
              { num: 2, label: "Medical Info", icon: Heart },
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={s.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center h-12 w-12 rounded-full border-2 transition-all ${
                        step >= s.num
                          ? "bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-500 text-white"
                          : "bg-white border-slate-300 text-slate-400"
                      }`}
                    >
                      {step > s.num ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        step >= s.num ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < 1 && (
                    <div
                      className={`h-0.5 w-12 md:w-24 mx-2 transition-all ${
                        step > s.num ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-8 md:p-12">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeUp">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                  <UserCircle className="h-6 w-6 text-emerald-600" />
                  Personal Information
                </h2>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-emerald-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                        errors.fullName
                          ? "border-red-300 focus:ring-red-200"
                          : "border-emerald-200 focus:ring-emerald-200"
                      } focus:ring-2 outline-none transition`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Age and Gender */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.age
                          ? "border-red-300 focus:ring-red-200"
                          : "border-emerald-200 focus:ring-emerald-200"
                      } focus:ring-2 outline-none transition`}
                      placeholder="Age"
                      min="1"
                      max="120"
                    />
                    {errors.age && (
                      <p className="mt-1 text-sm text-red-500">{errors.age}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.gender
                          ? "border-red-300 focus:ring-red-200"
                          : "border-emerald-200 focus:ring-emerald-200"
                      } focus:ring-2 outline-none transition`}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                    >
                      <option value="">Select</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-5 w-5 text-emerald-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                          errors.email
                            ? "border-red-300 focus:ring-red-200"
                            : "border-emerald-200 focus:ring-emerald-200"
                        } focus:ring-2 outline-none transition`}
                        placeholder="your@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-5 w-5 text-emerald-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                          errors.phone
                            ? "border-red-300 focus:ring-red-200"
                            : "border-emerald-200 focus:ring-emerald-200"
                        } focus:ring-2 outline-none transition`}
                        placeholder="10-digit mobile number"
                        maxLength="10"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-emerald-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                      placeholder="Street address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                      placeholder="6-digit pincode"
                      maxLength="6"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergencyName"
                      value={formData.emergencyName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                      placeholder="Contact person name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Emergency Contact Number
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                      placeholder="10-digit number"
                      maxLength="10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Medical Information */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeUp">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                  <Heart className="h-6 w-6 text-emerald-600" />
                  Medical Information
                </h2>

                {/* Medical Condition */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Medical Condition / Disease{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="selectedDisease"
                    value={formData.selectedDisease}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.selectedDisease
                        ? "border-red-300 focus:ring-red-200"
                        : "border-emerald-200 focus:ring-emerald-200"
                    } focus:ring-2 outline-none transition`}
                  >
                    <option value="">Select a condition</option>
                    {commonDiseases.map((disease) => (
                      <option key={disease} value={disease}>
                        {disease}
                      </option>
                    ))}
                  </select>
                  {errors.selectedDisease && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.selectedDisease}
                    </p>
                  )}
                </div>

                {/* Other Disease Input */}
                {formData.selectedDisease === "Other" && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Please Specify <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="otherDisease"
                      value={formData.otherDisease}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.otherDisease
                          ? "border-red-300 focus:ring-red-200"
                          : "border-emerald-200 focus:ring-emerald-200"
                      } focus:ring-2 outline-none transition`}
                      placeholder="Describe your condition"
                    />
                    {errors.otherDisease && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.otherDisease}
                      </p>
                    )}
                  </div>
                )}

                {/* Symptoms */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Current Symptoms <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.symptoms
                        ? "border-red-300 focus:ring-red-200"
                        : "border-emerald-200 focus:ring-emerald-200"
                    } focus:ring-2 outline-none transition resize-none`}
                    placeholder="Describe your current symptoms in detail..."
                  />
                  {errors.symptoms && (
                    <p className="mt-1 text-sm text-red-500">{errors.symptoms}</p>
                  )}
                </div>

                {/* Allergies */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Known Allergies
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                    placeholder="e.g., Penicillin, Peanuts, Latex (or 'None')"
                  />
                </div>

                {/* Current Medications */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Current Medications
                  </label>
                  <textarea
                    name="currentMedications"
                    value={formData.currentMedications}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-200 outline-none transition resize-none"
                    placeholder="List any medications you're currently taking..."
                  />
                </div>

                {/* Specialty Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Select Medical Specialty{" "}
                    <span className="text-slate-500 font-normal">(If you want or specifically need)</span>
                  </label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-3.5 h-5 w-5 text-emerald-400" />
                    <select
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                    >
                      <option value="">Choose specialty (optional)</option>
                      {specialties.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Upload Test Reports removed */}
              </div>
            )}

            {/* Step 3: Appointment Scheduling */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeUp"></div>
            )}

            {/* Step 4: Payment Information */}
            {step === 4 && (
              <div className="space-y-6 animate-fadeUp"></div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10 pt-6 border-t border-slate-200">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 rounded-xl border border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50 transition"
                >
                  Previous
                </button>
              )}

              {step < 2 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
                >
                  Next Step
                </button>
              ) : (
                <div className="ml-auto flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveOnly}
                    disabled={saving}
                    className="px-6 py-3 rounded-xl border-2 border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50 transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="h-5 w-5" />
                    {saving ? "Submitting..." : "Submit"}
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Stethoscope className="h-5 w-5" />
                    {saving ? "Saving..." : "See Doctors if Available"}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            HIPAA Compliant
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            End-to-End Encrypted
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            Secure Payment Gateway
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default PatientForm;
