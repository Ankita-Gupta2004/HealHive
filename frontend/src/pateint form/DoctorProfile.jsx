import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Award,
  CheckCircle,
  MessageCircle,
  Calendar,
} from "lucide-react";
import Navbar from "../Homepage/Navbar";
import Footer from "../Homepage/footer";
import { getDoctorById } from "../utils/doctorFilterService";

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Get doctor from route state or fetch by ID
  const doctor = location.state?.doctor || getDoctorById(parseInt(doctorId));

  useEffect(() => {
    if (!doctor) return;
    // If this is a registered doctor selection, record interest
    const recordSelection = async () => {
      try {
        if (!user || doctor.source !== "registered") return;
        const token = await user.getIdToken();
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/select/${doctor.id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("select doctor error", err);
      }
    };
    recordSelection();
  }, [doctor, user]);

  if (!doctor) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
          <div className="text-center">
            <p className="text-slate-600 text-lg">Doctor not found</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleBookConsultation = () => {
    if (!user) {
      alert("Please log in to continue.");
      navigate("/login");
      return;
    }
    if (!selectedSlot) {
      alert("Please select a time slot");
      return;
    }
    navigate(`/consultation-payment/${doctor.id}`, {
      state: {
        doctor,
        selectedSlot,
      },
    });
  };

  // Mock doctor additional details
  const doctorDetails = {
    rating: (Math.random() * 2 + 3.5).toFixed(1),
    reviews: Math.floor(Math.random() * 200 + 50),
    isOnline: Math.random() > 0.4,
    location: ["New Delhi", "Mumbai", "Bangalore"][Math.floor(Math.random() * 3)],
    about: `Dr. ${doctor.name} is a highly experienced ${doctor.specialty} specialist with over ${doctor.experience || 10} years of practice. Known for compassionate care and accurate diagnosis, Dr. ${doctor.name} has helped thousands of patients achieve better health outcomes.`,
    education: ["MBBS - Delhi University", "MD - Cardiology - AIIMS Delhi"],
    achievements: [
      "Best Doctor Award 2022",
      "Patient Choice Award 2023",
      "Medical Excellence Certificate",
    ],
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
        {/* Background gradients */}
        <div className="absolute -top-24 -left-24 h-96 w-96 bg-emerald-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-24 h-96 w-96 bg-teal-200/40 rounded-full blur-3xl animate-pulse delay-200" />

        <div className="relative max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50 transition mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Doctor Header Card */}
              <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden animate-fadeUp">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-32" />

                <div className="p-8 -mt-16 relative">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div>
                      <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-4xl border-4 border-white shadow-lg mb-4">
                        {doctor.name.charAt(0)}
                      </div>

                      <h1 className="text-3xl font-extrabold text-slate-900">Dr. {doctor.name}</h1>
                      <p className="text-lg font-semibold text-emerald-600 mt-1">{doctor.specialty}</p>

                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                          <span className="font-semibold text-slate-900">
                            {doctorDetails.rating}
                          </span>
                          <span className="text-slate-600 text-sm">
                            ({doctorDetails.reviews} reviews)
                          </span>
                        </div>
                        <span
                          className={`h-3 w-3 rounded-full ${
                            doctorDetails.isOnline ? "bg-green-500" : "bg-slate-300"
                          }`}
                        />
                        <span className="text-sm font-medium text-slate-600">
                          {doctorDetails.isOnline ? "Online Now" : "Offline"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="text-center bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                        <p className="text-xs text-slate-600 uppercase tracking-wide">
                          Consultation Fee
                        </p>
                        <p className="text-3xl font-bold text-emerald-600">{doctor.fee}</p>
                      </div>
                      <p className="text-xs text-slate-600 flex items-center justify-end gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {doctorDetails.location}
                      </p>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <Award className="h-4 w-4 text-emerald-600 mb-1" />
                      <p className="text-xs font-semibold text-slate-900">
                        {doctor.experience || 10}+ Years
                      </p>
                      <p className="text-xs text-slate-600">Experience</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <Users className="h-4 w-4 text-emerald-600 mb-1" />
                      <p className="text-xs font-semibold text-slate-900">{doctorDetails.reviews}+</p>
                      <p className="text-xs text-slate-600">Patients</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <Clock className="h-4 w-4 text-emerald-600 mb-1" />
                      <p className="text-xs font-semibold text-slate-900">30 mins</p>
                      <p className="text-xs text-slate-600">Session</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <CheckCircle className="h-4 w-4 text-emerald-600 mb-1" />
                      <p className="text-xs font-semibold text-slate-900">Verified</p>
                      <p className="text-xs text-slate-600">Licensed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-8 animate-fadeUp">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About</h2>
                <p className="text-slate-700 leading-relaxed">{doctorDetails.about}</p>
              </div>

              {/* Education & Achievements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fadeUp">
                <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-emerald-600" /> Education
                  </h3>
                  <ul className="space-y-3">
                    {doctorDetails.education.map((edu, idx) => (
                      <li key={idx} className="flex gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" /> Achievements
                  </h3>
                  <ul className="space-y-3">
                    {doctorDetails.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Languages */}
              <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 animate-fadeUp">
                <h3 className="font-bold text-slate-900 mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {(doctor.languages || "English, Hindi").split(",").map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-medium text-sm border border-emerald-200"
                    >
                      {lang.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Booking */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-6 sticky top-20 animate-fadeUp">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" /> Select Time Slot
                </h3>

                <div className="space-y-3 mb-6">
                  {Array.isArray(doctor.timeSlots) && doctor.timeSlots.length > 0 ? (
                    doctor.timeSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSlot(slot.time)}
                        disabled={!slot.available}
                        className={`w-full py-3 rounded-xl font-semibold transition ${
                          slot.available
                            ? selectedSlot === slot.time
                              ? "bg-emerald-600 text-white border-2 border-emerald-600"
                              : "bg-white border-2 border-emerald-200 text-slate-900 hover:border-emerald-400"
                            : "bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed"
                        }`}
                      >
                        {slot.time}
                        {!slot.available && " (Booked)"}
                        {slot.available && selectedSlot === slot.time && (
                          <CheckCircle className="inline-block h-4 w-4 ml-2" />
                        )}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-slate-600 text-center py-4">
                      No time slots available today
                    </p>
                  )}
                </div>

                {selectedSlot && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-slate-600 mb-1">Selected Time</p>
                    <p className="text-lg font-bold text-emerald-700">{selectedSlot}</p>
                  </div>
                )}

                <button
                  onClick={handleBookConsultation}
                  disabled={!selectedSlot}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                    selectedSlot
                      ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white hover:shadow-lg"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Continue to Payment
                </button>

                <button className="w-full mt-3 py-3 rounded-xl font-semibold border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition flex items-center justify-center gap-2">
                  <MessageCircle className="h-4 w-4" /> Message Doctor
                </button>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm text-slate-700">+91 9876543210</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm text-slate-700 truncate">doctor@healhive.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DoctorProfile;
