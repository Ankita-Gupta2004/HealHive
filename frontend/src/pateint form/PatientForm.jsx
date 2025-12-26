import { useState } from "react";
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  FileText,
  AlertCircle,
  Heart,
  CreditCard,
  CheckCircle,
  UserCircle,
  Upload,
  File,
  X,
  FileCheck,
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
    medicalDocuments: [],
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
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

      setMatchedDoctors(usingFallback ? fallbackDocs : matches);
      setUsedFallback(usingFallback);
      setTargetSpecialty(specialtyFocus);
      setShowResults(true);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const addFiles = (files) => {
    const validFiles = files.filter(
      (file) =>
        file.size <= 5 * 1024 * 1024 && // 5MB limit
        ["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(
          file.type
        )
    );

    if (validFiles.length > 0) {
      const newReports = validFiles.map((file) => ({
        id: Math.random(),
        name: file.name,
        size: (file.size / 1024).toFixed(2),
        type: file.type,
        file: file,
      }));
      setFormData((prev) => ({
        ...prev,
        medicalDocuments: [...prev.medicalDocuments, ...newReports],
      }));
    }
  };

  const removeFile = (fileId) => {
    setFormData((prev) => ({
      ...prev,
      medicalDocuments: prev.medicalDocuments.filter((f) => f.id !== fileId),
    }));
  };

  return (
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

                {/* Upload Test Reports */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    <div className="flex items-center gap-2 mb-3">
                      <FileCheck className="h-5 w-5 text-emerald-600" />
                      Upload Test Reports (Optional)
                    </div>
                  </label>

                  {/* Drag & Drop Area */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                      dragActive
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 hover:border-emerald-400"
                    }`}
                  >
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 rounded-full bg-emerald-100">
                        <Upload className="h-6 w-6 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900">
                        Drop your test reports here
                      </h3>
                      <p className="text-sm text-slate-500">
                        or click to browse (PDF, JPG, PNG - Max 5MB each)
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        Upload blood reports, X-rays, CT scans, etc.
                      </p>
                    </div>
                  </div>

                  {/* Uploaded Files List */}
                  {formData.medicalDocuments.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                        Uploaded Files ({formData.medicalDocuments.length})
                      </h4>
                      <div className="space-y-2">
                        {formData.medicalDocuments.map((report) => (
                          <div
                            key={report.id}
                            className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 hover:shadow-md transition"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {report.type === "application/pdf" ? (
                                <div className="p-2 rounded-lg bg-red-100">
                                  <FileText className="h-5 w-5 text-red-600" />
                                </div>
                              ) : (
                                <div className="p-2 rounded-lg bg-blue-100">
                                  <File className="h-5 w-5 text-blue-600" />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-slate-900 text-sm truncate">
                                  {report.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {report.size} KB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(report.id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* File Upload Tips */}
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Supported Documents:</p>
                      <ul className="text-xs space-y-1">
                        <li>• Blood Test Reports & Lab Results</li>
                        <li>• Medical Imaging (X-rays, CT Scans, MRI)</li>
                        <li>• Previous Prescriptions & Medical Records</li>
                        <li>• ECG, EEG & Other Diagnostic Reports</li>
                      </ul>
                    </div>
                  </div>
                </div>
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
                <button
                  type="submit"
                  className="ml-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition flex items-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  See Doctors if Available
                </button>
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
  );
};

export default PatientForm;
