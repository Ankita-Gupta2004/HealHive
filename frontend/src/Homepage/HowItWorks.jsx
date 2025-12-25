import {
  UserPlus,
  Stethoscope,
  CreditCard,
  Video,
  MessageSquare,
  FileText,
  ShieldCheck,
} from "lucide-react";

const steps = [
  {
    title: "Create Patient Profile",
    desc: "Enter basic patient details and select the required medical specialty for consultation.",
    icon: UserPlus,
  },
  {
    title: "Choose Specialty & Doctor",
    desc: "Browse verified doctors and specialists based on your medical needs.",
    icon: Stethoscope,
  },
  {
    title: "Secure Payment",
    desc: "Make a safe, encrypted payment before starting your telehealth session.",
    icon: CreditCard,
  },
  {
    title: "Live Video Consultation",
    desc: "Connect with doctors via real-time HD video for an in-person-like experience.",
    icon: Video,
  },
  {
    title: "Chat & Share Information",
    desc: "Chat during the session to share symptoms, reports, or prescriptions.",
    icon: MessageSquare,
  },
  {
    title: "AI Transcription & Records",
    desc: "Automatic transcription handles dialects & accents, securely saved for future access.",
    icon: FileText,
  },
];

const HowItWorks = () => {
  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-24 overflow-hidden">

      {/* Background glow */}
      <div className="absolute -top-24 left-1/3 h-96 w-96 bg-emerald-200/40 rounded-full blur-3xl animate-pulse" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fadeUp">
          <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-semibold">
            <ShieldCheck className="h-4 w-4" />
            Simple • Secure • Reliable
          </span>

          <h2 className="mt-6 text-3xl md:text-4xl font-extrabold text-slate-900">
            How HealHive Works
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            A seamless, end-to-end telehealth experience — designed to deliver
            quality healthcare from anywhere.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative bg-white rounded-2xl border border-emerald-100 shadow-sm p-8 transition-all animate-fadeUp hover:border-emerald-500"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                {/* Icon */}
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white mb-6 transition-transform group hover:scale-110">
                  <Icon className="h-7 w-7 group-hover:animate-pulse" />
                </div>

                {/* Step number */}
                <span className="absolute top-4 right-4 text-sm font-bold text-emerald-200">
                  0{index + 1}
                </span>

                <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-3 text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Footer trust */}
        <div className="mt-20 flex flex-wrap justify-center gap-8 text-slate-600 text-sm animate-fadeUp">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            HIPAA-grade Privacy
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            Encrypted Medical Records
          </div>
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-emerald-600" />
            In-Person-Like Experience
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
