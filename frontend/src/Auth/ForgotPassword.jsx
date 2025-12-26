import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../Homepage/Navbar";
import Footer from "../Homepage/footer";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const alreadyReset = localStorage.getItem("passwordResetDone");
    if (alreadyReset === "true") {
      localStorage.removeItem("passwordResetDone");
      navigate("/login");
    }

    const handleStorage = (event) => {
      if (event.key === "passwordResetDone" && event.newValue === "true") {
        localStorage.removeItem("passwordResetDone");
        navigate("/login");
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [navigate]);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email, {
        url: import.meta.env.VITE_PASSWORD_RESET_URL,
      });

      alert("Password reset email sent! Check your inbox (or spam).");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Forgot Password
          </h2>

          <form onSubmit={handleResetRequest} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
            />

            <button
              type="submit"
              className="w-full px-4 py-2 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
