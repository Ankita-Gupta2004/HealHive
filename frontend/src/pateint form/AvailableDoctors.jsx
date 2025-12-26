import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Star, Stethoscope } from "lucide-react";

const AvailableDoctors = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const doctors = location.state?.doctors || [];
  const usedFallback = location.state?.usedFallback;
  const targetSpecialty = location.state?.targetSpecialty || "General Medicine";
  const selectedDisease = location.state?.selectedDisease || "General Consultation";

  const handleBack = () => navigate(-1);

  if (!doctors.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
        <div className="bg-white border border-emerald-100 shadow-xl rounded-3xl p-10 max-w-xl text-center space-y-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100">
            <Stethoscope className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900">No doctors to show yet</h1>
            <p className="text-slate-600">Start with the patient form so we can suggest the right specialists for you.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/book")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-semibold shadow-lg hover:shadow-xl"
            >
              Go to Patient Form
            </button>
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-xl border border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-emerald-100 p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div>
            <p className="text-sm text-emerald-700 font-semibold">Suggested Specialty: {targetSpecialty}</p>
            <h1 className="text-2xl font-extrabold text-slate-900">Available Doctors</h1>
            <p className="text-sm text-slate-600">Filtered by your condition: {selectedDisease}</p>
          </div>
          <div className="flex items-center gap-3">
            {usedFallback && (
              <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-full">
                No exact match found — showing trusted General Medicine doctors.
              </span>
            )}
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-emerald-700 font-semibold">
                    {doc.specialty}
                  </p>
                  <h2 className="text-lg font-bold text-slate-900">{doc.name}</h2>
                  <p className="text-sm text-slate-600">{doc.experience} experience</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Consultation</p>
                  <p className="text-lg font-bold text-emerald-700">{doc.fee}</p>
                  <p className="text-xs text-emerald-600 inline-flex items-center justify-end gap-1">
                    <Clock className="h-4 w-4" /> {doc.availability}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(doc.diseases || []).slice(0, 4).map((diseaseTag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-white/80 border border-emerald-100 text-xs text-emerald-700"
                  >
                    {diseaseTag}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500" /> Trusted Doctor
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-700">
                  <Stethoscope className="h-4 w-4" /> {doc.languages}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableDoctors;
