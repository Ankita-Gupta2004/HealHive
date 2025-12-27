import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Phone,
  Video,
  MessageCircle,
  X,
  Send,
  Mic,
  MicOff,
  VideoOff,
  Copy,
  Check,
  Clock,
  AlertCircle,
  Lock,
} from "lucide-react";
import Navbar from "../../Homepage/Navbar";
import Footer from "../../Homepage/footer";

const CallRoom = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get payment status and doctor info from route state
  const { doctor, slot, paid, patientName } = location.state || {};
  const doctorName = doctor?.name || "Dr. Arjun Mehta";
  const doctorSpecialty = doctor?.specialty || "Cardiology";
  const doctorInitial = (() => {
    const name = doctorName.replace(/^Dr\.?\s*/i, "");
    return (name[0] || "D").toUpperCase();
  })();

  // States
  const [callStatus, setCallStatus] = useState("waiting"); // waiting, calling, connected, ended
  const [callType, setCallType] = useState(null); // chat, voice, video
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "doctor",
      senderName: doctorName,
      text: "Hello! I'm ready to help you. How are you feeling today?",
      timestamp: new Date(Date.now() - 5000),
    },
  ]);
  const [messageInput, setMessageInput] = useState("");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef(null);
  const callTimerRef = useRef(null);

  // Patient info (optional)
  const mockPatient = {
    name: patientName || "Patient",
    avatar: "P",
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Call timer
  useEffect(() => {
    if (callStatus === "connected") {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(callTimerRef.current);
  }, [callStatus]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Send message
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "patient",
        senderName: "You",
        text: messageInput,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setMessageInput("");

      // Mock doctor response
      setTimeout(() => {
            setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "doctor",
                senderName: doctorName,
            text: "I understand. Let me check your symptoms more carefully.",
            timestamp: new Date(),
          },
        ]);
      }, 1500);
    }
  };

  // Start call
  const startCall = (type) => {
    setCallType(type);
    setCallStatus("calling");

    // Mock: Call connects after 3 seconds
    setTimeout(() => {
      setCallStatus("connected");
    }, 3000);
  };

  // End call
  const endCall = () => {
    setCallStatus("ended");
    setCallType(null);
    setCallDuration(0);
    if (callTimerRef.current) clearInterval(callTimerRef.current);
  };

  // Copy consultation ID
  const copyConsultationId = () => {
    navigator.clipboard.writeText(consultationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-4 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Consultation Room
                </h1>
                <p className="text-sm text-slate-600">
                  ID: {consultationId}
                  <button
                    onClick={copyConsultationId}
                    className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </>
                    )}
                  </button>
                </p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="h-6 w-6 text-slate-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Call Area */}
            <div className="lg:col-span-2">
              {/* Video/Call Display */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden aspect-video flex items-center justify-center relative mb-6 group">
                {callStatus === "waiting" || callStatus === "calling" ? (
                  <div className="text-center text-white space-y-4">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-3xl font-bold mx-auto">
                      {doctorInitial}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{doctorName}</h2>
                      <p className="text-emerald-300">{doctorSpecialty}</p>
                    </div>
                    {callStatus === "calling" && (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-pulse h-3 w-3 rounded-full bg-emerald-500" />
                        <span>{callType === "video" ? "Starting video call..." : "Starting call..."}</span>
                      </div>
                    )}
                  </div>
                ) : callStatus === "connected" ? (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800">
                    {callType === "video" ? (
                      <div className="w-full h-full flex">
                        {/* Remote Video (Mock) */}
                        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-600">
                          <div className="text-center">
                            <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center text-white text-5xl font-bold mx-auto mb-4">
                              {doctorInitial}
                            </div>
                            <p className="text-white font-semibold">{doctorName}</p>
                          </div>
                        </div>

                        {/* Local Video (Mock) */}
                        <div className="absolute bottom-4 right-4 w-32 h-32 rounded-xl bg-gradient-to-br from-teal-600 to-green-600 flex items-center justify-center border-2 border-white shadow-lg">
                          <div className="text-center">
                            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-1">
                              P
                            </div>
                            <p className="text-white text-xs font-semibold">You</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-white space-y-4">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-4xl font-bold mx-auto">
                          {doctorInitial}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{doctorName}</h2>
                          <p className="text-emerald-300">{doctorSpecialty}</p>
                        </div>
                        <p className="text-lg font-semibold text-emerald-300">
                          {formatTime(callDuration)}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-white space-y-4">
                    <div className="h-20 w-20 rounded-full bg-red-500/30 flex items-center justify-center text-5xl mx-auto">
                      ⊘
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Call Ended</h2>
                      <p className="text-emerald-300">Duration: {formatTime(callDuration)}</p>
                    </div>
                  </div>
                )}

                {/* Call Duration Badge */}
                {callStatus === "connected" && (
                  <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {formatTime(callDuration)}
                  </div>
                )}

                {/* Doctor Status Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Online
                </div>
              </div>

              {/* Controls */}
              {callStatus !== "waiting" && (
                <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    {callStatus === "connected" && callType !== "chat" && (
                      <>
                        <button
                          onClick={() => setIsMicOn(!isMicOn)}
                          className={`h-14 w-14 rounded-full flex items-center justify-center font-bold transition transform hover:scale-110 ${
                            isMicOn
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "bg-red-600 text-white hover:bg-red-700"
                          }`}
                          title={isMicOn ? "Mute" : "Unmute"}
                        >
                          {isMicOn ? (
                            <Mic className="h-6 w-6" />
                          ) : (
                            <MicOff className="h-6 w-6" />
                          )}
                        </button>

                        {callType === "video" && (
                          <button
                            onClick={() => setIsVideoOn(!isVideoOn)}
                            className={`h-14 w-14 rounded-full flex items-center justify-center font-bold transition transform hover:scale-110 ${
                              isVideoOn
                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                            title={isVideoOn ? "Stop Video" : "Start Video"}
                          >
                            {isVideoOn ? (
                              <Video className="h-6 w-6" />
                            ) : (
                              <VideoOff className="h-6 w-6" />
                            )}
                          </button>
                        )}
                      </>
                    )}

                    <button
                      onClick={callStatus === "connected" ? endCall : () => setCallStatus("waiting")}
                      className="h-14 w-14 rounded-full bg-red-600 text-white flex items-center justify-center font-bold hover:bg-red-700 transition transform hover:scale-110"
                      title="End Call"
                    >
                      <Phone className="h-6 w-6" />
                    </button>
                  </div>

                  {callStatus === "waiting" && (
                  <div className="mt-4 flex gap-3 justify-center flex-wrap">
                    {!paid ? (
                      <div className="w-full flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900">
                        <Lock className="h-5 w-5 flex-shrink-0" />
                        <span className="font-semibold text-sm">
                          Complete payment to start consultation
                        </span>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => startCall("chat")}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
                        >
                          <MessageCircle className="h-5 w-5" /> Start Chat
                        </button>
                        <button
                          onClick={() => startCall("voice")}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition"
                        >
                          <Phone className="h-5 w-5" /> Voice Call
                        </button>
                        <button
                          onClick={() => startCall("video")}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                        >
                          <Video className="h-5 w-5" /> Video Call
                        </button>
                      </>
                    )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chat Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm flex flex-col h-full max-h-[600px] lg:max-h-full">
                {/* Chat Header */}
                <div className="p-4 border-b border-emerald-100">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-emerald-600" /> Consultation Chat
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Messages with {doctorName}
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "patient" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs rounded-2xl px-4 py-2.5 ${
                          msg.sender === "patient"
                            ? "bg-emerald-600 text-white rounded-br-none"
                            : "bg-slate-100 text-slate-900 rounded-bl-none"
                        }`}
                      >
                        {msg.sender === "doctor" && (
                          <p className="text-xs font-semibold mb-1 opacity-75">
                            {msg.senderName}
                          </p>
                        )}
                        <p className="text-sm">{msg.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender === "patient"
                              ? "text-emerald-100"
                              : "text-slate-600"
                          }`}
                        >
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-emerald-100 space-y-3">
                  {callStatus === "ended" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2 text-sm text-amber-800">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <p>
                        This consultation has ended. You can review the chat history.
                      </p>
                    </div>
                  )}

                  {!paid && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 text-sm text-red-800">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <p>
                        Payment is required to start chatting with the doctor.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      disabled={callStatus === "ended" || !paid}
                      className="flex-1 px-3 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm disabled:opacity-50 disabled:bg-gray-100"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || callStatus === "ended" || !paid}
                      className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50 disabled:bg-gray-400"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CallRoom;
