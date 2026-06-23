import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle,
  Video,
  ChevronRight,
  Search,
} from 'lucide-react';
import Navbar from '../Homepage/Navbar';
import Footer from '../Homepage/footer';

const ConsultationHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchConsultations();
  }, [user]);

  const fetchConsultations = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/consultations/history`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch consultations');
      }

      const data = await response.json();
      setConsultations(data.consultations || []);
    } catch (err) {
      console.error('Error fetching consultations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConsultation = async (consultationId) => {
    if (!window.confirm('Are you sure you want to cancel this consultation?')) {
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/consultations/${consultationId}/cancel`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to cancel consultation');
      }

      await fetchConsultations();
      alert('✅ Consultation cancelled successfully');
    } catch (err) {
      console.error('Error cancelling consultation:', err);
      alert('❌ Failed to cancel consultation. Please try again.');
    }
  };

  const handleJoinCall = (consultationId) => {
    navigate(`/chat/${consultationId}`);
  };

  const getFilteredConsultations = () => {
    let filtered = consultations;

    if (activeTab === 'upcoming') {
      filtered = filtered.filter(c => c.status === 'upcoming');
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(c => c.status === 'completed');
    } else if (activeTab === 'cancelled') {
      filtered = filtered.filter(c => c.status === 'cancelled');
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.doctorName.toLowerCase().includes(query) ||
        c.doctorSpecialty.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
  };

  const filteredConsultations = getFilteredConsultations();

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      upcoming: {
        icon: Calendar,
        color: 'text-blue-700 bg-blue-50 border-blue-200',
        label: 'Upcoming',
      },
      completed: {
        icon: CheckCircle,
        color: 'text-green-700 bg-green-50 border-green-200',
        label: 'Completed',
      },
      cancelled: {
        icon: XCircle,
        color: 'text-red-700 bg-red-50 border-red-200',
        label: 'Cancelled',
      },
      'in-progress': {
        icon: AlertCircle,
        color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
        label: 'In Progress',
      },
    };

    const config = statusConfig[status] || statusConfig.upcoming;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="h-3.5 w-3.5" />
        {config.label}
      </span>
    );
  };

  const ConsultationCard = ({ consultation }) => {
    const isUpcoming = consultation.status === 'upcoming';

    return (
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {consultation.doctorName.charAt(0)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900">
                      {consultation.doctorName}
                    </h3>
                    <StatusBadge status={consultation.status} />
                  </div>

                  <p className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                    <Stethoscope className="h-3.5 w-3.5" />
                    {consultation.doctorSpecialty}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-emerald-500" />
                      {new Date(consultation.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-emerald-500" />
                      {consultation.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4 text-emerald-500" />
                      Fee: ₹{consultation.fee}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
              {isUpcoming && (
                <>
                  <button
                    onClick={() => handleJoinCall(consultation.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition shadow-md hover:shadow-lg"
                  >
                    <Video className="h-4 w-4" />
                    Join Call
                  </button>
                  <button
                    onClick={() => handleCancelConsultation(consultation.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel
                  </button>
                </>
              )}

              {consultation.status === 'completed' && (
                <button
                  onClick={() => navigate(`/consultation/${consultation.id}`)}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-200 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getTabCount = (status) => {
    return consultations.filter(c => c.status === status).length;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center animate-fadeUp">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
              My Consultations
            </h1>
            <p className="text-slate-600 mt-2">
              View and manage all your consultations
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6 border-b border-emerald-100 pb-2">
            {['upcoming', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition capitalize ${
                  activeTab === tab
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:bg-emerald-50'
                }`}
              >
                {tab} ({getTabCount(tab)})
              </button>
            ))}
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by doctor name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mx-auto"></div>
              <p className="text-slate-600 mt-4">Loading consultations...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-200">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-600 font-semibold">Error loading consultations</p>
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={fetchConsultations}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : filteredConsultations.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-emerald-100">
              <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg font-semibold">No consultations found</p>
              <p className="text-slate-500 text-sm mt-1">
                {activeTab === 'upcoming' && "You don't have any upcoming consultations"}
                {activeTab === 'completed' && "You haven't completed any consultations yet"}
                {activeTab === 'cancelled' && "No cancelled consultations"}
              </p>
              {activeTab === 'upcoming' && (
                <button
                  onClick={() => navigate('/doctors')}
                  className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
                >
                  Find a Doctor
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4 animate-fadeUp">
              {filteredConsultations.map((consultation) => (
                <ConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ConsultationHistory;