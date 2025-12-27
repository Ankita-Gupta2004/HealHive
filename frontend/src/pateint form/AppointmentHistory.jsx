import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  MessageCircle,
  Star,
  Phone,
  ArrowRight,
  Pill,
  FileText,
  Download,
  Eye,
} from "lucide-react";
import Navbar from "../Homepage/Navbar";
import Footer from "../Homepage/footer";

const AppointmentHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming"); // upcoming, completed

  // Mock appointment data
  const upcomingAppointments = [
    {
      id: 1,
      doctorName: "Dr. Arjun Mehta",
      specialty: "Cardiology",
      avatar: "A",
      date: "2024-01-20",
      time: "2:30 PM",
      consultationFee: 500,
      status: "confirmed",
      meetingLink: "https://call.healhive.com/cons_12345",
      type: "video",
    },
    {
      id: 2,
      doctorName: "Dr. Priya Sharma",
      specialty: "General Medicine",
      avatar: "P",
      date: "2024-01-25",
      time: "10:00 AM",
      consultationFee: 400,
      status: "scheduled",
      meetingLink: "https://call.healhive.com/cons_12346",
      type: "video",
    },
  ];

  const completedAppointments = [
    {
      id: 101,
      doctorName: "Dr. Raj Patel",
      specialty: "Dermatology",
      avatar: "R",
      date: "2024-01-10",
      time: "3:00 PM",
      duration: "28 min",
      consultationFee: 450,
      status: "completed",
      rating: 5,
      feedback: "Very helpful and professional",
      prescription: {
        medicines: [
          "Cetirizine 10mg - 1 tablet daily",
          "Betnovate Cream - Apply twice daily",
        ],
        followUp: "After 2 weeks",
      },
    },
    {
      id: 102,
      doctorName: "Dr. Anjali Singh",
      specialty: "Orthopedics",
      avatar: "A",
      date: "2024-01-05",
      time: "11:30 AM",
      duration: "25 min",
      consultationFee: 500,
      status: "completed",
      rating: 4,
      feedback: "Good consultation, gave clear instructions",
      prescription: {
        medicines: ["Ibuprofen 400mg - 1 tablet thrice daily"],
        followUp: "After 1 week",
      },
    },
    {
      id: 103,
      doctorName: "Dr. Vivek Kumar",
      specialty: "Neurology",
      avatar: "V",
      date: "2023-12-28",
      time: "4:15 PM",
      duration: "32 min",
      consultationFee: 600,
      status: "completed",
      rating: 5,
      feedback: "Excellent diagnosis and treatment plan",
      prescription: {
        medicines: [
          "Medication 1 - Instructions",
          "Medication 2 - Instructions",
        ],
        followUp: "After 3 weeks",
      },
    },
  ];

  const currentAppointments = activeTab === "upcoming" ? upcomingAppointments : completedAppointments;

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Consultation History
            </h1>
            <p className="text-slate-600">
              Track your past and upcoming medical consultations
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-emerald-200">
            {[
              { id: "upcoming", label: "Upcoming", count: upcomingAppointments.length },
              { id: "completed", label: "Completed", count: completedAppointments.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 font-semibold transition relative ${
                  activeTab === tab.id
                    ? "text-emerald-700"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-600" />
                )}
              </button>
            ))}
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {currentAppointments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-12 text-center">
                <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No {activeTab} appointments
                </h3>
                <p className="text-slate-600 mb-6">
                  {activeTab === "upcoming"
                    ? "Schedule a consultation with a doctor to get started"
                    : "Your completed consultations will appear here"}
                </p>
                {activeTab === "upcoming" && (
                  <button
                    onClick={() => navigate("/doctor-search")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
                  >
                    Find a Doctor <ArrowRight className="h-5 w-5" />
                  </button>
                )}
              </div>
            ) : (
              currentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-lg transition overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                      {/* Doctor Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                          {appointment.avatar}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-900">
                            {appointment.doctorName}
                          </h3>
                          <p className="text-sm text-slate-600 mb-3">
                            {appointment.specialty}
                          </p>

                          {/* Appointment Details */}
                          <div className="flex flex-wrap gap-3 gap-y-2 text-sm">
                            <div className="flex items-center gap-2 text-slate-700">
                              <Calendar className="h-4 w-4 text-emerald-600" />
                              {formatDate(appointment.date)}
                            </div>
                            <div className="flex items-center gap-2 text-slate-700">
                              <Clock className="h-4 w-4 text-emerald-600" />
                              {appointment.time}
                            </div>
                            {appointment.duration && (
                              <div className="flex items-center gap-2 text-slate-700">
                                <Clock className="h-4 w-4 text-emerald-600" />
                                {appointment.duration}
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-slate-700">
                              <span className="font-semibold">
                                ₹{appointment.consultationFee}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="w-full md:w-auto flex flex-col gap-3 items-stretch md:items-end">
                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          {appointment.status === "completed" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                              <span className="h-2 w-2 rounded-full bg-green-600" />
                              Completed
                            </span>
                          )}
                          {appointment.status === "confirmed" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                              <span className="h-2 w-2 rounded-full bg-emerald-600" />
                              Confirmed
                            </span>
                          )}
                          {appointment.status === "scheduled" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                              <span className="h-2 w-2 rounded-full bg-blue-600" />
                              Scheduled
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {activeTab === "upcoming" && (
                          <button
                            onClick={() =>
                              navigate(
                                `/call-room/${appointment.id}`,
                                { state: { appointment } }
                              )
                            }
                            className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition font-semibold text-sm flex items-center justify-center gap-2"
                          >
                            <Phone className="h-4 w-4" /> Join Call
                          </button>
                        )}

                        {activeTab === "completed" && (
                          <div className="flex gap-2">
                            <button
                              className="flex-1 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition font-semibold text-sm flex items-center justify-center gap-2"
                              title="View prescription"
                            >
                              <FileText className="h-4 w-4" /> Prescription
                            </button>
                            <button
                              className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition font-semibold text-sm"
                              title="Rate consultation"
                            >
                              <Star className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Completed Appointment Details */}
                    {activeTab === "completed" && (
                      <div className="mt-6 pt-6 border-t border-emerald-100 space-y-4">
                        {/* Rating */}
                        {appointment.rating && (
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < appointment.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-slate-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-slate-900">
                              {appointment.rating}.0
                            </span>
                            <span className="text-sm text-slate-600">
                              "{appointment.feedback}"
                            </span>
                          </div>
                        )}

                        {/* Prescription */}
                        {appointment.prescription && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Pill className="h-4 w-4 text-emerald-600" />
                                Medicines
                              </h4>
                              <ul className="space-y-2">
                                {appointment.prescription.medicines.map(
                                  (medicine, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm text-slate-700 pl-4"
                                    >
                                      <span className="text-emerald-600 font-bold">
                                        •
                                      </span>{" "}
                                      {medicine}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>

                            <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-teal-600" />
                                Follow-up
                              </h4>
                              <p className="text-sm text-slate-700">
                                {appointment.prescription.followUp}
                              </p>

                              <div className="mt-4 flex gap-2">
                                <button className="flex-1 px-3 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition font-semibold text-xs flex items-center justify-center gap-1">
                                  <Download className="h-3.5 w-3.5" /> Download
                                </button>
                                <button className="flex-1 px-3 py-2 rounded-lg bg-white border border-teal-600 text-teal-600 hover:bg-teal-50 transition font-semibold text-xs flex items-center justify-center gap-1">
                                  <MessageCircle className="h-3.5 w-3.5" />
                                  Share
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={() => navigate("/doctor-search")}
                            className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition font-semibold text-sm flex items-center justify-center gap-2"
                          >
                            Book Another Consultation
                          </button>
                          <button className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition font-semibold text-sm flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" /> Message Doctor
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AppointmentHistory;
