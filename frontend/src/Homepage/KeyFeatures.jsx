import {
  Video,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Mic,
  Folder,
} from "lucide-react";

const features = [
  {
    title: "Secure Video Consultation",
    desc: "Connect with doctors via encrypted HD video for a private, in-person-like experience.",
    icon: Video,
  },
  {
    title: "Real-Time Chat",
    desc: "Share symptoms, reports, and updates instantly during consultation.",
    icon: MessageSquare,
  },
  {
    title: "Encrypted Patient Data",
    desc: "All PHI is securely stored and fully HIPAA-compliant.",
    icon: ShieldCheck,
  },
  {
    title: "Online Payment",
    desc: "Pay safely before your consultation starts using secure gateways.",
    icon: CreditCard,
  },
  {
    title: "AI Accent-Aware Transcription",
    desc: "Automatic transcription handles dialects and accents for accurate records.",
    icon: Mic,
  },
  {
    title: "Appointment History & Records",
    desc: "View past consultations, prescriptions, and reports securely in one place.",
    icon: Folder,
  },
];


const KeyFeatures = () => {
  return (
    <section className="relative bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-24 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fadeUp">
          <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-semibold">
            Problem → Solution
          </span>
          <h2 className="mt-6 text-3xl md:text-4xl font-extrabold text-slate-900">
            Key Features of HealHive
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Designed to solve the urgent need for accessible, secure, and reliable healthcare from anywhere.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="relative bg-white border border-emerald-100 rounded-2xl shadow-sm p-6 md:p-8 text-center transition-all hover:border-emerald-500 hover:shadow-md animate-fadeUp"
                style={{ animationDelay: `${idx * 120}ms` }}
              >
                {/* Icon */}
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white mx-auto mb-4 transition-transform group hover:scale-110">
                  <Icon className="h-8 w-8 group-hover:animate-pulse" />
                </div>

                {/* Text */}
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-slate-600 text-sm">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
