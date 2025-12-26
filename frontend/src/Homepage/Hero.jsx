import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Stethoscope,
  Video,
  FileText,
  CreditCard,
} from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Background gradients */}
      <div className="absolute -top-24 -left-24 h-96 w-96 bg-emerald-200/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 -right-24 h-96 w-96 bg-teal-200/40 rounded-full blur-3xl animate-pulse delay-200" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* LEFT */}
        <div className="space-y-8 animate-fadeUp">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 px-4 py-1 text-sm font-medium">
            <Stethoscope className="h-4 w-4" />
            Digital Telehealth Platform
          </span>

          <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight text-slate-900">
            Quality Healthcare,
            <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
              Anytime. Anywhere.
            </span>
          </h1>

          <p className="text-lg text-slate-600 max-w-xl">
            HealHive enables secure telehealth consultations with live video,
            chat, online payments, and AI-powered transcription — delivering
            hospital-quality care at home.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 px-6 py-3 text-white font-semibold shadow-lg hover:scale-105 transition"
            >
              <Video className="h-5 w-5" />
              Consult a Doctor
            </Link>

            <button
              onClick={() => {
                document
                  .getElementById("how-it-works")
                  .scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-6 py-3 text-emerald-700 font-semibold hover:bg-emerald-50 transition"
            >
              How It Works
            </button>
          </div>

          {/* Trust / features */}
          <div className="flex flex-wrap gap-6 pt-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Secure & Private
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              AI Transcription
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-600" />
              Pay Before Consult
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative animate-float">
          <div className="rounded-3xl bg-white shadow-2xl border border-emerald-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                <Video className="h-4 w-4" />
                Live Consultation
              </span>
              <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
            </div>

            {/* Video cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="h-40 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex flex-col items-center justify-center gap-2 text-emerald-700 font-medium">
                <Stethoscope className="h-8 w-8" />
                Doctor
              </div>
              <div className="h-40 rounded-xl bg-gradient-to-br from-teal-100 to-green-100 flex flex-col items-center justify-center gap-2 text-emerald-700 font-medium">
                <Video className="h-8 w-8" />
                Patient
              </div>
            </div>

            {/* Transcript */}
            <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-slate-700">
              <p className="font-semibold text-emerald-700 mb-1 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Live Transcript
              </p>
              <p className="animate-typing overflow-hidden whitespace-nowrap">
                “I have been experiencing headaches for the past few days…”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
