import {
  UserCircle,
  Stethoscope,
  Activity,
  Heart,
  FileText,
  File,
  ShieldCheck,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Pill,
  BadgeCheck,
} from "lucide-react";

// A presentational dashboard for a single patient.
// Pass a `patient` prop to override the sample data below.
const samplePatient = {
  name: "Ankita Gupta",
  age: 32,
  gender: "Female",
  bloodGroup: "O+",
  email: "ankita@example.com",
  phone: "+91 9876543210",
  location: "Remote, India",
  primaryCondition: "Hypertension",
  specialty: "Cardiology",
  doctor: "Dr. Arjun Mehta",
  status: "Under Review",
  symptoms: ["Headache", "Elevated BP", "Mild dizziness"],
  medications: ["Amlodipine 5mg", "Lifestyle changes"] ,
  lastVisit: "2025-11-12",
  nextFollowUp: "2026-01-05",
  medicalHistory: [
    {
      title: "Annual Checkup",
      date: "2025-05-18",
      note: "Normal ECG, advised routine monitoring.",
    },
    {
      title: "Telehealth Consult",
      date: "2024-12-03",
      note: "BP slightly high, started low-dose Amlodipine.",
    },
  ],
  testReports: [
    { name: "Blood Panel.pdf", type: "pdf", size: "420 KB", date: "2025-11-10" },
    { name: "ECG.png", type: "img", size: "310 KB", date: "2025-11-10" },
  ],
};

const Badge = ({ label, tone = "emerald" }) => {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-100 text-emerald-700"
      : tone === "amber"
      ? "bg-amber-100 text-amber-700"
      : "bg-slate-100 text-slate-700";
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${toneClass}`}>
      <ShieldCheck className="h-4 w-4" />
      {label}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, helper }) => (
  <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">
    <div className="flex items-center gap-3 mb-3">
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-lg font-semibold text-slate-900">{value}</p>
      </div>
    </div>
    {helper && <p className="text-xs text-slate-500">{helper}</p>}
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm text-slate-700">
    <span className="text-slate-500">{label}</span>
    <span className="font-medium text-slate-900">{value || "—"}</span>
  </div>
);

const PatientDashboard = ({ patient = samplePatient }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-10">
      {/* Background accents */}
      <div className="absolute -top-24 -left-24 h-72 w-72 bg-emerald-200/40 rounded-full blur-3xl" />
      <div className="absolute top-40 -right-24 h-72 w-72 bg-teal-200/40 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-emerald-700 font-semibold flex items-center gap-2">
              <Stethoscope className="h-4 w-4" /> Patient Dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-1">
              {patient.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Badge label={patient.status || "Active"} tone="emerald" />
              {patient.primaryCondition && (
                <Badge label={patient.primaryCondition} tone="amber" />
              )}
              {patient.specialty && (
                <span className="text-sm text-slate-600 inline-flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-emerald-500" />
                  {patient.specialty}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge label={`Doctor: ${patient.doctor || "Not assigned"}`} />
            <Badge label={`Next Follow-up: ${patient.nextFollowUp || "—"}`} tone="amber" />
          </div>
        </div>

        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1 bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center text-2xl font-bold">
                {patient.name?.[0] || "P"}
              </div>
              <div>
                <p className="text-sm text-slate-500">Patient</p>
                <p className="text-xl font-bold text-slate-900">{patient.name}</p>
                <p className="text-sm text-emerald-600 font-medium">{patient.primaryCondition || "—"}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <InfoRow label="Age" value={patient.age} />
              <InfoRow label="Gender" value={patient.gender} />
              <InfoRow label="Blood Group" value={patient.bloodGroup} />
              <InfoRow label="Email" value={patient.email} />
              <InfoRow label="Phone" value={patient.phone} />
              <InfoRow label="Location" value={patient.location} />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              icon={Activity}
              label="Primary Condition"
              value={patient.primaryCondition || "—"}
              helper="Latest assessment"
            />
            <StatCard
              icon={Heart}
              label="Assigned Doctor"
              value={patient.doctor || "Not assigned"}
              helper={patient.specialty ? `${patient.specialty} Specialist` : ""}
            />
            <StatCard
              icon={Calendar}
              label="Last Visit"
              value={patient.lastVisit || "—"}
              helper="Previous consultation date"
            />
            <StatCard
              icon={Clock}
              label="Next Follow-up"
              value={patient.nextFollowUp || "To be scheduled"}
              helper="Suggested timeline"
            />
          </div>
        </div>

        {/* Middle Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Symptoms & Meds */}
          <div className="lg:col-span-2 bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">Symptoms & Notes</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Symptoms</p>
                <div className="flex flex-wrap gap-2">
                  {(patient.symptoms || []).map((sym, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm"
                    >
                      {sym}
                    </span>
                  ))}
                  {(!patient.symptoms || patient.symptoms.length === 0) && (
                    <span className="text-sm text-slate-500">No symptoms listed.</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Current Medications</p>
                <div className="space-y-2">
                  {(patient.medications || []).map((med, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-slate-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2"
                    >
                      <Pill className="h-4 w-4 text-emerald-500" /> {med}
                    </div>
                  ))}
                  {(!patient.medications || patient.medications.length === 0) && (
                    <span className="text-sm text-slate-500">No medications recorded.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact card */}
          <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <BadgeCheck className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">Care Team</h3>
            </div>
            <InfoRow label="Doctor" value={patient.doctor || "Not assigned"} />
            <InfoRow label="Specialty" value={patient.specialty || "—"} />
            <InfoRow label="Email" value={patient.email || "—"} />
            <InfoRow label="Phone" value={patient.phone || "—"} />
            <InfoRow label="Location" value={patient.location || "—"} />
          </div>
        </div>

        {/* Test Reports & History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports */}
          <div className="lg:col-span-2 bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <File className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">Uploaded Test Reports</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {(patient.testReports || []).map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50"
                >
                  <div className={`p-2 rounded-xl ${file.type === "pdf" ? "bg-red-100" : "bg-blue-100"}`}>
                    {file.type === "pdf" ? (
                      <FileText className="h-5 w-5 text-red-600" />
                    ) : (
                      <File className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{file.size} • {file.date}</p>
                  </div>
                  <button className="text-emerald-600 text-xs font-semibold hover:underline">View</button>
                </div>
              ))}
              {(!patient.testReports || patient.testReports.length === 0) && (
                <p className="text-sm text-slate-500">No reports uploaded.</p>
              )}
            </div>
          </div>

          {/* History */}
          <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">Medical History</h3>
            </div>
            <div className="space-y-4">
              {(patient.medicalHistory || []).map((event, idx) => (
                <div key={idx} className="relative pl-4 border-l border-emerald-200">
                  <span className="absolute -left-2 top-1 h-3 w-3 rounded-full bg-emerald-500" />
                  <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                  <p className="text-xs text-slate-500 mb-1">{event.date}</p>
                  <p className="text-sm text-slate-600">{event.note}</p>
                </div>
              ))}
              {(!patient.medicalHistory || patient.medicalHistory.length === 0) && (
                <p className="text-sm text-slate-500">No history recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
