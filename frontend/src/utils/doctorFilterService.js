// Doctor data and filtering logic

export const doctors = [
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
    id: 7,
    name: "Dr. Anika Verma",
    specialty: "Pediatrics",
    diseases: ["Fever", "Cold", "Flu", "Nutrition"],
    fee: "₹500",
    availability: "Today • 4 slots",
    experience: "7 yrs",
    languages: "English, Hindi",
    timeSlots: [
      { time: "10:00 AM", available: true },
      { time: "12:00 PM", available: true },
      { time: "04:00 PM", available: false },
    ],
  },
  {
    id: 8,
    name: "Dr. Rohit Menon",
    specialty: "ENT",
    diseases: ["Sinusitis", "Ear Infection", "Tonsillitis"],
    fee: "₹550",
    availability: "Tomorrow • 3 slots",
    experience: "10 yrs",
    languages: "English, Malayalam, Hindi",
    timeSlots: [
      { time: "09:30 AM", available: true },
      { time: "02:00 PM", available: true },
      { time: "05:30 PM", available: false },
    ],
  },
  {
    id: 9,
    name: "Dr. Priya Nair",
    specialty: "Gynecology",
    diseases: ["PCOS", "Menstrual Disorder", "Pregnancy Care"],
    fee: "₹650",
    availability: "Today • 2 slots",
    experience: "9 yrs",
    languages: "English, Hindi",
    timeSlots: [
      { time: "11:00 AM", available: true },
      { time: "03:00 PM", available: true },
    ],
  },
  {
    id: 10,
    name: "Dr. Amit Desai",
    specialty: "Gastroenterology",
    diseases: ["Acidity", "Ulcer", "IBS", "GERD"],
    fee: "₹700",
    availability: "Tomorrow • 5 slots",
    experience: "12 yrs",
    languages: "English, Gujarati, Hindi",
    timeSlots: [
      { time: "10:30 AM", available: true },
      { time: "01:30 PM", available: true },
      { time: "06:00 PM", available: true },
    ],
  },
  {
    id: 11,
    name: "Dr. Shreya Kapoor",
    specialty: "Endocrinology",
    diseases: ["Diabetes", "Thyroid", "Hormonal Issues"],
    fee: "₹750",
    availability: "Today • 3 slots",
    experience: "8 yrs",
    languages: "English, Hindi",
    timeSlots: [
      { time: "09:00 AM", available: true },
      { time: "12:30 PM", available: false },
      { time: "05:00 PM", available: true },
    ],
  },
  {
    id: 12,
    name: "Dr. Farhan Ali",
    specialty: "Pulmonology",
    diseases: ["Asthma", "COPD", "Bronchitis"],
    fee: "₹600",
    availability: "Today • 4 slots",
    experience: "10 yrs",
    languages: "English, Hindi, Urdu",
    timeSlots: [
      { time: "10:00 AM", available: true },
      { time: "01:00 PM", available: true },
      { time: "04:30 PM", available: true },
    ],
  },
  {
    id: 13,
    name: "Dr. Nisha Gupta",
    specialty: "Nephrology",
    diseases: ["Kidney Disease", "UTI"],
    fee: "₹800",
    availability: "Tomorrow • 2 slots",
    experience: "11 yrs",
    languages: "English, Hindi",
    timeSlots: [
      { time: "11:30 AM", available: true },
      { time: "03:30 PM", available: true },
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

/**
 * Maps a disease to its recommended specialty
 * @param {string} disease - The disease name
 * @returns {string} - The specialty name
 */
export const findSpecialtyForDisease = (disease) => {
  if (!disease) return "General Medicine";
  
  const lower = disease.toLowerCase();
  
  const specialtyMap = {
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

  // Check exact match first
  if (specialtyMap[lower]) return specialtyMap[lower];

  // Check partial matches for skin, ear, nose, throat
  if (lower.includes("skin")) return "Dermatology";
  if (lower.includes("ear") || lower.includes("nose") || lower.includes("throat")) 
    return "ENT";

  // Default to General Medicine
  return "General Medicine";
};

/**
 * Filters doctors based on disease and specialty
 * @param {string} selectedDisease - The disease selected by patient
 * @param {string} preferredSpecialty - Optional specialty preference
 * @returns {Object} - { doctors, usedFallback, targetSpecialty }
 */
export const filterDoctors = (selectedDisease, preferredSpecialty = null) => {
  // Determine the target specialty
  const targetSpecialty = preferredSpecialty || findSpecialtyForDisease(selectedDisease);

  // Filter doctors by specialty or disease match
  const matches = doctors.filter((doc) => {
    const specialtyMatch = doc.specialty.toLowerCase() === targetSpecialty.toLowerCase();
    const diseaseMatch = selectedDisease
      ? (doc.diseases || []).some(
          (d) => d.toLowerCase() === selectedDisease.toLowerCase()
        )
      : false;
    return specialtyMatch || diseaseMatch;
  });

  // If no matches, use General Medicine doctors as fallback
  const fallbackDocs = doctors.filter((doc) => doc.specialty === "General Medicine");
  const usedFallback = matches.length === 0;
  const doctorsToShow = usedFallback ? fallbackDocs : matches;

  return {
    doctors: doctorsToShow,
    usedFallback,
    targetSpecialty,
  };
};

/**
 * Get all available doctors
 * @returns {Array} - All doctors
 */
export const getAllDoctors = () => {
  return doctors;
};

/**
 * Get doctor by ID
 * @param {number} id - Doctor ID
 * @returns {Object|null} - Doctor object or null if not found
 */
export const getDoctorById = (id) => {
  return doctors.find(doc => doc.id === id) || null;
};

/**
 * Get doctors by specialty
 * @param {string} specialty - Specialty name
 * @returns {Array} - Filtered doctors
 */
export const getDoctorsBySpecialty = (specialty) => {
  return doctors.filter(doc => 
    doc.specialty.toLowerCase() === specialty.toLowerCase()
  );
};
