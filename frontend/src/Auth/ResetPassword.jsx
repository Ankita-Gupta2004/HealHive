import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { useSearchParams } from "react-router-dom";
import Navbar from "../Homepage/Navbar";
import Footer from "../Homepage/footer";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const oobCode = searchParams.get("oobCode");

  useEffect(() => {
    const verifyCode = async () => {
      try {
        const email = await verifyPasswordResetCode(auth, oobCode);
        setVerifiedEmail(email);
      } catch (error) {
        alert("Invalid or expired reset link.");
      } finally {
        setLoading(false);
      }
    };
    verifyCode();
  }, [oobCode]);

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess(true);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <p className="text-center mt-20">Verifying link...</p>;
  }

  // ✅ Password reset success UI
  if (success) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Password Reset Successful
            </h2>
            <p className="text-gray-700">
              Your password has been successfully reset. <br />
              You can now go back to the previous tab and log in.
            </p>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Reset Password
          </h2>

          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
            />

            <button
              type="submit"
              className="w-full px-4 py-2 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              Reset Password
            </button>
          </form>

          
        </div>
      </div>

      <Footer />
    </>
  );
}
