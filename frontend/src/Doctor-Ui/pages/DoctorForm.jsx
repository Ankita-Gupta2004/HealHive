import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext.jsx";
import {
  User,
  Calendar,
  Phone,
  Mail,
  Stethoscope,
  CheckCircle,
  UserCircle,
} from "lucide-react";
import Navbar from "../../Homepage/Navbar.jsx";
import Footer from "../../Homepage/footer.jsx";

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

const DoctorForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    experience: "",
    qualification: "",
    specialty: "",
    consultationFee: "",
    availableDays: [],
    availableTimeSlots: "",
    languages: "",
    additionalNotes: "",
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const daysOfWeek = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData(prev => {
        const days = prev.availableDays.includes(value)
          ? prev.availableDays.filter(d => d !== value)
          : [...prev.availableDays, value];
        return { ...prev, availableDays: days };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Name is required";
      } else if (formData.fullName.length < 3) {
        newErrors.fullName = "Name must be at least 3 characters";
      }

      if (!formData.age) {
        newErrors.age = "Age is required";
      } else if (formData.age < 25 || formData.age > 75) {
        newErrors.age = "Doctors must be between 25 and 75 years old";
      }

      if (!formData.gender) newErrors.gender = "Please select a gender";

      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        newErrors.email = "Please enter a valid email address";
      }

      // Stricter Phone Validation (Indian format example)
      if (!formData.phone.match(/^[6-9]\d{9}$/)) {
        newErrors.phone = "Enter a valid 10-digit mobile number";
      }
    }

    if (currentStep === 2) {
      if (!formData.qualification.trim()) newErrors.qualification = "Qualification (e.g. MBBS) is required";
      
      if (!formData.experience) {
        newErrors.experience = "Experience is required";
      } else if (formData.experience < 0 || formData.experience > 50) {
        newErrors.experience = "Please enter valid years of experience (0-50)";
      }

      if (!formData.specialty) newErrors.specialty = "Please select your medical specialty";

      if (!formData.consultationFee) {
        newErrors.consultationFee = "Consultation fee is required";
      } else if (formData.consultationFee < 0) {
        newErrors.consultationFee = "Fee cannot be negative";
      } else if (formData.consultationFee > 10000) {
        newErrors.consultationFee = "Fee seems too high (Max ₹10,000)";
      }
    }

    if (currentStep === 3) {
      if (formData.availableDays.length === 0) {
        newErrors.availableDays = "Select at least one day you are available";
      }
      if (!formData.availableTimeSlots.trim()) {
        newErrors.availableTimeSlots = "Please specify your timing (e.g., 10 AM - 2 PM)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if(validateStep(step)) setStep(prev => prev +1); };
  const handlePrevious = () => setStep(prev => prev -1);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateStep(step)) return;

  if (!user) {
    alert("Please login first");
    return;
  }

  setSaving(true);

  try {
    const token = await user.getIdToken();

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/doctor/submit`,
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
      const errData = await res.json();
      throw new Error(errData.message || "Failed to submit");
    }

    const data = await res.json();
    console.log("✅ Doctor saved in DB:", data);

    // ✅ SUCCESS → redirect to homepage
    navigate("/");

  } catch (err) {
    console.error("❌ Submit error:", err.message);
    alert(err.message || "Failed to save data. Try again.");
  } finally {
    setSaving(false);
  }
};


  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
          <div className="max-w-lg w-full bg-white border border-emerald-100 rounded-3xl shadow-xl p-8 text-center space-y-4 animate-fadeUp">
            <h1 className="text-2xl font-bold text-slate-900">Login required</h1>
            <p className="text-slate-600">Please sign in to complete doctor registration.</p>
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:scale-[1.01] transition"
            >
              Go to Login
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-10 animate-fadeUp">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Stethoscope className="h-8 w-8 text-emerald-600" />
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
                Doctor Registration
              </h1>
            </div>
            <p className="text-slate-600">Fill in your details to join as a registered doctor</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-8 md:p-12">
            <form onSubmit={handleSubmit}>

              {/* Step 1 */}
              {step===1 && (
                <div className="space-y-6 animate-fadeUp">
                  <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                    <UserCircle className="h-6 w-6 text-emerald-600"/> Personal Info
                  </h2>
                  <div>
                    <label>Full Name *</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter full name" className="w-full border px-3 py-2 rounded-xl"/>
                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label>Age *</label>
                      <input type="number" name="age" value={formData.age} onChange={handleChange} min="25" max="80" className="w-full border px-3 py-2 rounded-xl"/>
                      {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                    </div>

                    <div>
                      <label>Gender *</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border px-3 py-2 rounded-xl">
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                    </div>

                    <div>
                      <label>Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" className="w-full border px-3 py-2 rounded-xl"/>
                      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label>Phone *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit number" className="w-full border px-3 py-2 rounded-xl"/>
                      {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                    </div>

                    <div>
                      <label>Address</label>
                      <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street address" className="w-full border px-3 py-2 rounded-xl"/>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step===2 && (
                <div className="space-y-6 animate-fadeUp">
                  <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><Stethoscope/> Professional Info</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label>Qualification *</label>
                      <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="MBBS, MD, etc." className="w-full border px-3 py-2 rounded-xl"/>
                      {errors.qualification && <p className="text-red-500 text-sm">{errors.qualification}</p>}
                    </div>

                    <div>
                      <label>Experience *</label>
                      <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="Years" className="w-full border px-3 py-2 rounded-xl"/>
                      {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
                    </div>
                  </div>

                  <div>
                    <label>Specialty *</label>
                    <select name="specialty" value={formData.specialty} onChange={handleChange} className="w-full border px-3 py-2 rounded-xl">
                      <option value="">Select specialty</option>
                      {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.specialty && <p className="text-red-500 text-sm">{errors.specialty}</p>}
                  </div>

                  <div>
                    <label>Consultation Fee (₹) *</label>
                    <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} placeholder="e.g., 500" className="w-full border px-3 py-2 rounded-xl"/>
                    {errors.consultationFee && <p className="text-red-500 text-sm">{errors.consultationFee}</p>}
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step===3 && (
                <div className="space-y-6 animate-fadeUp">
                  <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><Calendar/> Availability & Languages</h2>

                  <div>
                    <label>Available Days *</label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map(day => (
                        <label key={day} className="flex items-center gap-1">
                          <input type="checkbox" name="availableDays" value={day} checked={formData.availableDays.includes(day)} onChange={handleChange}/>
                          {day}
                        </label>
                      ))}
                    </div>
                    {errors.availableDays && <p className="text-red-500 text-sm">{errors.availableDays}</p>}
                  </div>

                  <div>
                    <label>Time Slots *</label>
                    <input type="text" name="availableTimeSlots" value={formData.availableTimeSlots} onChange={handleChange} placeholder="e.g., 9AM-1PM, 4PM-8PM" className="w-full border px-3 py-2 rounded-xl"/>
                    {errors.availableTimeSlots && <p className="text-red-500 text-sm">{errors.availableTimeSlots}</p>}
                  </div>

                  <div>
                    <label>Languages</label>
                    <input type="text" name="languages" value={formData.languages} onChange={handleChange} placeholder="English, Hindi, etc." className="w-full border px-3 py-2 rounded-xl"/>
                  </div>

                  <div>
                    <label>Additional Notes</label>
                    <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} rows="3" className="w-full border px-3 py-2 rounded-xl"/>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                {step>1 && <button type="button" onClick={handlePrevious} className="px-4 py-2 border rounded-xl">Previous</button>}
                {step<3 && <button type="button" onClick={handleNext} className="px-4 py-2 bg-emerald-600 text-white rounded-xl ml-auto">Next</button>}
                {step===3 && <button type="submit" disabled={saving} className="px-4 py-2 bg-emerald-600 text-white rounded-xl ml-auto flex items-center gap-2"><CheckCircle className="h-5 w-5"/>{saving ? "Saving..." : "Submit"}</button>}
              </div>

            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DoctorForm;
