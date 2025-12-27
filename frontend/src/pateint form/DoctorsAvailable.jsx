import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Clock,
  Star,
  Stethoscope,
  CreditCard,
  CheckCircle,
  MapPin,
  Award,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import Navbar from "../Homepage/Navbar";
import Footer from "../Homepage/footer";

const DoctorsAvailable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSlots, setSelectedSlots] = useState({}); // { [doctorId]: time }
  const [viewedDoctorId, setViewedDoctorId] = useState(null); // Track expanded doctor
  const { user } = useAuth();
  // Guard: require login to view available doctors
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-lg p-8 text-center max-w-md">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Login Required</h2>
            <p className="text-slate-600 mb-4">Please log in to view available doctors.</p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold"
            >
              Go to Login
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const doctors = location.state?.doctors || [];
  const usedFallback = location.state?.usedFallback;
  const targetSpecialty = location.state?.targetSpecialty || "General Medicine";
  const selectedDisease = location.state?.selectedDisease || "General Consultation";

  const handleBack = () => navigate(-1);

  const handleSelectSlot = (docId, time, available) => {
    if (!available) return;
    setSelectedSlots((prev) => ({ ...prev, [docId]: time }));
  };

  const handlePay = async (doc) => {
    const slot = selectedSlots[doc.id];
    if (!slot) {
      alert("Please select an available time slot first.");
      return;
    }

    if (!user) {
      alert("Please log in to proceed.");
      navigate("/login");
      return;
    }

    try {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: doc.id,
          doctorName: doc.name,
          slotTime: slot,
          fee: doc.fee,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Payment failed: ${res.status} ${res.statusText} ${text.slice(0, 80)}`
        );
      }

      const data = await res.json();
      console.log("✅ Consultation initiated:", data);

      // Navigate to chat with returned consultationId
      navigate(`/chat/${data.consultationId}`, {
        state: {
          doctorId: doc.id,
          doctorName: doc.name,
          slotTime: slot,
        },
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "Payment initiation failed");
    }
  };

  // Empty state
  if (!doctors.length) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
          <div className="bg-white border border-emerald-100 shadow-xl rounded-3xl p-10 max-w-xl text-center space-y-6 animate-fadeUp">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100">
              <Stethoscope className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-slate-900">
                No doctors available
              </h1>
              <p className="text-slate-600">
                Complete the patient form to get matched with the right specialists for your
                condition.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/patient-form")}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
              >
                Go to Patient Form
              </button>
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-xl border border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50 transition"
              >
                Back
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* Background gradients */}
        <div className="absolute -top-24 -left-24 h-96 w-96 bg-emerald-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-24 h-96 w-96 bg-teal-200/40 rounded-full blur-3xl animate-pulse delay-200" />

        <div className="relative max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="animate-fadeUp">
                <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                  Suggested Specialty: {targetSpecialty}
                </p>
                <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
                  Available Doctors
                </h1>
                <p className="text-slate-600 mt-2">
                  Filtered based on your condition: <span className="font-semibold">{selectedDisease}</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {usedFallback && (
                  <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full font-semibold">
                    ⚠️ Showing General Medicine doctors
                  </div>
                )}
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50 transition"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </div>
          </div>

          {/* Doctor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => {
              const isExpanded = viewedDoctorId === doc.id;
              const hasSelectedSlot = selectedSlots[doc.id];

              return (
                <div
                  key={doc.id}
                  className="group bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden animate-fadeUp"
                >
                  {/* Doctor Header */}
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-b border-emerald-100">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                        {doc.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">{doc.name}</h3>
                        <p className="text-sm font-semibold text-emerald-700">{doc.specialty}</p>
                        <p className="text-xs text-slate-600 mt-1 inline-flex items-center gap-1">
                          <Award className="h-3.5 w-3.5" /> {doc.experience}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Details */}
                  <div className="p-6 space-y-4">
                    {/* Fee & Availability */}
                    <div className="flex items-center justify-between bg-emerald-50 rounded-xl p-3">
                      <div>
                        <p className="text-xs text-slate-600 uppercase tracking-wide">
                          Consultation Fee
                        </p>
                        <p className="text-xl font-bold text-emerald-700">{doc.fee}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-600 uppercase tracking-wide">
                          Availability
                        </p>
                        <p className="text-sm font-semibold text-slate-900 inline-flex items-center gap-1">
                          <Clock className="h-4 w-4 text-emerald-600" /> {doc.availability}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2 font-semibold">
                        Specialization
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(doc.diseases || []).slice(0, 3).map((disease, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full bg-white border border-emerald-100 text-xs text-emerald-700 font-medium"
                          >
                            {disease}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <MessageCircle className="h-4 w-4 text-emerald-600" />
                      <span>{doc.languages}</span>
                    </div>

                    {/* Time Slots */}
                    {Array.isArray(doc.timeSlots) && doc.timeSlots.length > 0 && (
                      <div className="border-t border-emerald-100 pt-4">
                        <p className="text-xs uppercase tracking-wide text-slate-600 font-semibold mb-3">
                          Available Slots
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {doc.timeSlots.map((slot, idx) => {
                            const isSelected = selectedSlots[doc.id] === slot.time;
                            return (
                              <button
                                key={idx}
                                onClick={() => handleSelectSlot(doc.id, slot.time, slot.available)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                  slot.available
                                    ? isSelected
                                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                                      : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400"
                                    : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                                }`}
                                disabled={!slot.available}
                              >
                                {slot.time}
                                {isSelected && slot.available && (
                                  <CheckCircle className="inline-block h-3 w-3 ml-1.5" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-xs text-slate-600 mt-2">
                          {selectedSlots[doc.id] ? (
                            <span className="text-emerald-700 font-semibold">
                              ✓ Selected: {selectedSlots[doc.id]}
                            </span>
                          ) : (
                            "Select a time slot above"
                          )}
                        </p>
                      </div>
                    )}

                    {/* Trust Badge */}
                    <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
                      <Star className="h-3.5 w-3.5 text-amber-500" />
                      <span className="font-semibold">Verified & Trusted Doctor</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-6 bg-slate-50 border-t border-emerald-100">
                    <button
                      onClick={() => handlePay(doc)}
                      disabled={!hasSelectedSlot}
                      className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                        hasSelectedSlot
                          ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-lg hover:shadow-xl"
                          : "bg-slate-200 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      <CreditCard className="h-4 w-4" /> Proceed to Payment
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Info */}
          <div className="mt-12 bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 md:p-8 animate-fadeUp">
            <h3 className="text-lg font-bold text-slate-900 mb-4">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Select a Doctor</p>
                  <p className="text-sm text-slate-600">Choose from verified specialists</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Pick a Time Slot</p>
                  <p className="text-sm text-slate-600">Choose a convenient time</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Complete Payment</p>
                  <p className="text-sm text-slate-600">Secure and instant consultation</p>
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

export default DoctorsAvailable;
