import { useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle,
  AlertCircle,
  X,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Shield,
  Lock,
} from "lucide-react";
import Navbar from "../Homepage/Navbar";
import Footer from "../Homepage/footer";
import { useAuth } from "../Context/AuthContext";

const ConsultationPayment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Get doctor and slot from navigation state
  const { doctor, selectedSlot } = location.state || {};

  // Form states
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, processing, success, failed
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Fallback to mock doctor if not passed via state
  const mockDoctor = doctor || {
    id: doctorId || 1,
    name: "Dr. Arjun Mehta",
    specialty: "Cardiology",
    fee: "₹500",
  };

  const mockSlot = selectedSlot || "2024-01-15, 2:30 PM";
  const fee = (() => {
    const v = mockDoctor.fee ?? 0;
    if (typeof v === "number") return v;
    const parsed = parseInt(String(v).replace(/[^0-9]/g, ""), 10);
    return isNaN(parsed) ? 0 : parsed;
  })();

  // Handle form change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      // Format card number with spaces
      const formatted = value.replace(/\s/g, "").slice(0, 16);
      const parts = [];
      for (let i = 0; i < formatted.length; i += 4) {
        parts.push(formatted.slice(i, i + 4));
      }
      setFormData({ ...formData, [name]: parts.join(" ") });
    } else if (name === "expiryDate") {
      // Format as MM/YY
      const formatted = value.replace(/\D/g, "").slice(0, 4);
      if (formatted.length >= 2) {
        setFormData({
          ...formData,
          [name]: formatted.slice(0, 2) + "/" + formatted.slice(2, 4),
        });
      } else {
        setFormData({ ...formData, [name]: formatted });
      }
    } else if (name === "cvv") {
      // Only numbers, max 4
      setFormData({ ...formData, [name]: value.replace(/\D/g, "").slice(0, 4) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Payment validations
  const cardNumberDigits = formData.cardNumber.replace(/\s/g, "");
  const luhnValid = useMemo(() => {
    if (!cardNumberDigits || cardNumberDigits.length < 12) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumberDigits.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumberDigits[i], 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  }, [cardNumberDigits]);

  const brandHint = useMemo(() => {
    if (cardNumberDigits.startsWith("4")) return "Visa";
    const mcPrefixes = [/^5[1-5]/, /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/];
    if (mcPrefixes.some((r) => r.test(cardNumberDigits))) return "Mastercard";
    if (/^6/.test(cardNumberDigits)) return "RuPay/Discover";
    return cardNumberDigits.length >= 6 ? "Card" : "";
  }, [cardNumberDigits]);

  const expiryValid = useMemo(() => {
    const [mm, yy] = formData.expiryDate.split("/");
    if (!mm || !yy || mm.length !== 2 || yy.length !== 2) return false;
    const month = parseInt(mm, 10);
    const year = 2000 + parseInt(yy, 10);
    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) return false;
    const now = new Date();
    const exp = new Date(year, month - 1, 1);
    exp.setMonth(exp.getMonth() + 1); // end of expiry month
    return exp > now;
  }, [formData.expiryDate]);

  const cvvValid = useMemo(() => {
    return /^[0-9]{3,4}$/.test(formData.cvv);
  }, [formData.cvv]);

  const upiValid = useMemo(() => {
    return /^[a-zA-Z0-9\.\-_]{2,}@[a-zA-Z]{2,}$/.test(formData.upi || "");
  }, [formData.upi]);

  const baseInfoValid = useMemo(() => {
    return (
      !!formData.fullName &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || "") &&
      /^\d{10}$/.test(formData.phone || "")
    );
  }, [formData.fullName, formData.email, formData.phone]);

  const canPay = useMemo(() => {
    if (!baseInfoValid) return false;
    if (paymentMethod === "card") return luhnValid && expiryValid && cvvValid;
    if (paymentMethod === "upi") return upiValid;
    if (paymentMethod === "wallet") return true;
    return false;
  }, [baseInfoValid, paymentMethod, luhnValid, expiryValid, cvvValid, upiValid]);

  // Handle payment submission
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to continue.");
      navigate("/login");
      return;
    }

    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      (paymentMethod === "card" &&
        (!formData.cardNumber || !formData.expiryDate || !formData.cvv))
    ) {
      alert("Please fill all required fields");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("processing");

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate consultation ID
      const consultationId = "CONS_" + Date.now();

      // Always succeed - mock payment successful
      setPaymentStatus("success");

      // Redirect to call room after 2 seconds
      setTimeout(() => {
        navigate(`/call-room/${consultationId}`, {
          state: {
            doctor: mockDoctor,
            slot: mockSlot,
            paid: true,
            consultationId: consultationId,
            patientName: formData.fullName,
            patientEmail: formData.email,
          },
        });
      }, 2000);
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("failed");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-4 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-semibold mb-6 transition"
          >
            <ArrowLeft className="h-5 w-5" /> Back to Doctor Profile
          </button>

          {paymentStatus === "success" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="w-full max-w-md bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-white/10 backdrop-blur-sm p-6 md:p-8 text-center text-white">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                  <p className="mb-4 opacity-90">
                    Your consultation booking is confirmed. Redirecting to call room...
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>Doctor: {mockDoctor.name}</p>
                    <p>Amount: ₹{fee}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentStatus === "failed" && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-6 flex gap-4">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-900 mb-1">Payment Failed</h3>
                <p className="text-sm text-red-800 mb-4">
                  Your payment could not be processed. Please check your details and try
                  again.
                </p>
                <button
                  onClick={() => {
                    setPaymentStatus(null);
                    setIsProcessing(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Summary Card */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 sticky top-4 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
                    Consultation Summary
                  </h3>

                  {/* Doctor Info */}
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-emerald-100">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                      {mockDoctor.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">
                        {mockDoctor.name}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {mockDoctor.specialty}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-600 text-xs">Date & Time</p>
                        <p className="font-semibold text-slate-900">
                          {mockSlot}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-600 text-xs">Duration</p>
                        <p className="font-semibold text-slate-900">30 minutes</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Shield className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-600 text-xs">Platform</p>
                        <p className="font-semibold text-slate-900">
                          HealHive Video Consultation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown (no GST) */}
                <div className="pt-6 border-t border-emerald-100 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Consultation Fee</span>
                    <span className="font-semibold text-slate-900">₹{fee}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-emerald-100">
                    <span className="font-bold text-slate-900">Total Amount</span>
                    <span className="font-bold text-emerald-600 text-lg">₹{fee}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="bg-emerald-50 rounded-lg p-3 flex items-center gap-2 text-xs text-emerald-800">
                  <Lock className="h-4 w-4" />
                  Secure payment. Your data is encrypted.
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="md:col-span-2">
              <form onSubmit={handlePayment} className="space-y-6">
                {/* Payment Method Selection */}
                <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
                    Payment Method
                  </h3>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "card", name: "Card", icon: CreditCard },
                      { id: "upi", name: "UPI", icon: Smartphone },
                      { id: "wallet", name: "Wallet", icon: Wallet },
                    ].map(({ id, name, icon: Icon }) => (
                      <label
                        key={id}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                          paymentMethod === id
                            ? "border-emerald-600 bg-emerald-50"
                            : "border-emerald-100 bg-white hover:bg-emerald-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={id}
                          checked={paymentMethod === id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="absolute opacity-0"
                          disabled={isProcessing}
                        />
                        <div className="flex flex-col items-center gap-2">
                          <Icon
                            className={`h-6 w-6 ${
                              paymentMethod === id
                                ? "text-emerald-600"
                                : "text-slate-400"
                            }`}
                          />
                          <span
                            className={`text-sm font-semibold ${
                              paymentMethod === id
                                ? "text-emerald-600"
                                : "text-slate-600"
                            }`}
                          >
                            {name}
                          </span>
                        </div>
                        {paymentMethod === id && (
                          <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-emerald-600" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Your Information
                  </h3>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={isProcessing}
                      className="w-full px-4 py-2.5 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition disabled:opacity-50"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isProcessing}
                        className="w-full px-4 py-2.5 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition disabled:opacity-50"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={isProcessing}
                        className="w-full px-4 py-2.5 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition disabled:opacity-50"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                {/* Card Details (if card selected) */}
                {paymentMethod === "card" && (
                  <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                      Card Details
                    </h3>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        disabled={isProcessing}
                        className="w-full px-4 py-2.5 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition disabled:opacity-50 font-mono tracking-widest"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                      <div className="mt-1 text-xs flex items-center gap-2">
                        <span className={`font-semibold ${luhnValid ? "text-emerald-600" : "text-slate-500"}`}>
                          {brandHint || ""}
                        </span>
                        {!luhnValid && cardNumberDigits.length >= 12 && (
                          <span className="text-red-600">Invalid card number</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          disabled={isProcessing}
                          className="w-full px-4 py-2.5 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition disabled:opacity-50 font-mono"
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                        {!expiryValid && formData.expiryDate && (
                          <p className="text-xs mt-1 text-red-600">Invalid or expired</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          disabled={isProcessing}
                          className="w-full px-4 py-2.5 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition disabled:opacity-50 font-mono"
                          placeholder="123"
                          maxLength="4"
                        />
                        {!cvvValid && formData.cvv && (
                          <p className="text-xs mt-1 text-red-600">3-4 digits required</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Details (if UPI selected) */}
                {paymentMethod === "upi" && (
                  <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                      UPI Details
                    </h3>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        UPI ID *
                      </label>
                      <input
                        type="text"
                        name="upi"
                        disabled={isProcessing}
                        className="w-full px-4 py-2.5 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition disabled:opacity-50"
                        placeholder="yourname@paytm"
                        value={formData.upi || ""}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs mt-1 text-slate-500">Format: name@bank (e.g., john@upi)</p>
                    </div>
                  </div>
                )}

                {/* Payment Button */}
                <button
                  type="submit"
                  disabled={isProcessing || paymentStatus === "success" || !canPay}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      Processing Payment...
                    </>
                  ) : paymentStatus === "success" ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Payment Successful
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      {canPay ? `Pay ₹${fee}` : "Complete details to pay"}
                    </>
                  )}
                </button>

                {/* Terms */}
                <p className="text-xs text-slate-600 text-center">
                  By clicking "Pay", you agree to our{" "}
                  <a href="#" className="text-emerald-600 hover:underline font-semibold">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-emerald-600 hover:underline font-semibold">
                    Privacy Policy
                  </a>
                  . Your data is secure and encrypted.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ConsultationPayment;
