import { useEffect, useState } from "react";
import {
  Stethoscope,
  Calendar,
  Clock,
  Users,
  IndianRupee,
  Bell,
  MessageSquare,
  Video,
  Search,
  User,
  X,
} from "lucide-react";

const statsTemplate = [
  { label: "Today's Appointments", key: "appointments", icon: Calendar },
  { label: "Total Patients", key: "patients", icon: Users },
  { label: "Pending Consultations", key: "pending", icon: Clock },
  { label: "Today's Earnings", key: "earnings", icon: IndianRupee },
];

const appointments = [
  {
    id: 1,
    patient: "Ankita Gupta",
    time: "10:30 AM",
    issue: "Hypertension",
    status: "Approved",
  },
  {
    id: 2,
    patient: "Rahul Verma",
    time: "12:00 PM",
    issue: "Chest Pain",
    status: "Pending",
  },
];

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-100 flex items-center gap-4">
    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center">
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctorFormData");
    if (storedDoctor) {
      setDoctor(JSON.parse(storedDoctor));
    }
  }, []);

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        No doctor data found. Please complete profile first.
      </div>
    );
  }

  const statsData = {
    appointments: appointments.length,
    patients: 124,
    pending: appointments.filter(a => a.status === "Pending").length,
    earnings: `₹${doctor.consultationFee * appointments.length}`,
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setEditData(prev => {
        const days = prev.availableDays.includes(value)
          ? prev.availableDays.filter(d => d !== value)
          : [...prev.availableDays, value];
        return { ...prev, availableDays: days };
      });
    } else {
      setEditData(prev => ({ ...prev, [name]: value }));
    }
  };

  const saveProfile = () => {
    localStorage.setItem("doctorFormData", JSON.stringify(editData));
    setDoctor(editData);
    setOpenEdit(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div>
          <p className="text-emerald-600 font-semibold flex items-center gap-2">
            <Stethoscope className="h-4 w-4" /> Doctor Dashboard
          </p>
          <h1 className="text-4xl font-extrabold text-slate-900">
            Welcome, Dr. {doctor.fullName} 👋
          </h1>
          <p className="text-slate-600 mt-1">
            {doctor.specialty || "N/A"} • {doctor.experience || 0} yrs experience
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsTemplate.map((s, i) => (
            <StatCard
              key={i}
              icon={s.icon}
              label={s.label}
              value={statsData[s.key]}
            />
          ))}
        </div>

        {/* APPOINTMENTS */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-600" />
            Today's Appointments
          </h2>

          <div className="space-y-3">
            {appointments.map((a) => (
              <div
                key={a.id}
                className="flex flex-col md:flex-row md:justify-between md:items-center p-4 rounded-xl bg-emerald-50 border border-emerald-100 gap-3"
              >
                <div>
                  <p className="font-semibold">{a.patient}</p>
                  <p className="text-sm text-slate-500">
                    {a.issue} • {a.time}
                  </p>
                </div>

                {a.status === "Approved" ? (
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white flex items-center gap-1">
                      <Video className="h-4 w-4" /> Video
                    </button>
                    <button className="px-4 py-2 rounded-lg border border-emerald-600 text-emerald-700 flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" /> Chat
                    </button>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-orange-600">
                    {a.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PROFILE */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 max-w-md">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-600" />
            Doctor Profile
          </h2>

          <div className="space-y-1 text-sm text-slate-700">
            <p><b>Email:</b> {doctor.email || "N/A"}</p>
            <p><b>Phone:</b> {doctor.phone || "N/A"}</p>
            <p><b>Gender:</b> {doctor.gender || "N/A"}</p>
            <p><b>Qualification:</b> {doctor.qualification || "N/A"}</p>
           <p>
  <b>Languages:</b>{" "}
  {Array.isArray(doctor.languages) 
    ? doctor.languages.join(", ") 
    : (doctor.languages ? doctor.languages : "N/A")}
</p>

            <p><b>Fees:</b> ₹{doctor.consultationFee || 0}</p>
            <p>
              <b>Availability:</b>{" "}
              {(doctor.availableDays ?? []).join(", ")} ({doctor.availableTimeSlots || "N/A"})
            </p>
          </div>

          <button
            onClick={() => { setOpenEdit(true); setEditData(doctor); }}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {openEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative space-y-4">
            <button
              onClick={() => setOpenEdit(false)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-2">Edit Profile</h2>

            <div className="space-y-3 text-sm">
              <input
                type="text"
                name="fullName"
                value={editData.fullName}
                onChange={handleEditChange}
                placeholder="Full Name"
                className="w-full px-3 py-2 border rounded-xl"
              />
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleEditChange}
                placeholder="Email"
                className="w-full px-3 py-2 border rounded-xl"
              />
              <input
                type="tel"
                name="phone"
                value={editData.phone}
                onChange={handleEditChange}
                placeholder="Phone"
                className="w-full px-3 py-2 border rounded-xl"
              />
              <input
                type="text"
                name="qualification"
                value={editData.qualification}
                onChange={handleEditChange}
                placeholder="Qualification"
                className="w-full px-3 py-2 border rounded-xl"
              />
              <input
                type="number"
                name="consultationFee"
                value={editData.consultationFee}
                onChange={handleEditChange}
                placeholder="Consultation Fee"
                className="w-full px-3 py-2 border rounded-xl"
              />
              <input
                type="text"
                name="availableTimeSlots"
                value={editData.availableTimeSlots}
                onChange={handleEditChange}
                placeholder="Available Time Slots"
                className="w-full px-3 py-2 border rounded-xl"
              />
              <div className="flex flex-wrap gap-2">
                {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => (
                  <label key={day} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      value={day}
                      checked={editData.availableDays.includes(day)}
                      onChange={handleEditChange}
                      className="w-4 h-4"
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={saveProfile}
              className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-xl"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
