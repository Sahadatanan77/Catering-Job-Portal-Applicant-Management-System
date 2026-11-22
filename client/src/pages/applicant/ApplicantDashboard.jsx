import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { applicantService } from '../../services/applicantService';
import { jobService } from '../../services/jobService';
import StatusBadge from '../../components/StatusBadge';
import {
  User,
  Briefcase,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Phone,
  MapPin,
  AlertCircle,
  PartyPopper,
} from 'lucide-react';

const ApplicantDashboard = () => {
  const { user, applicant, refreshUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refreshUser();
        const appRes = await jobService.getMyApplications();
        if (appRes.success) {
          setApplications(appRes.applications || []);
        }
      } catch (err) {
        console.warn('Dashboard fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate profile completeness score
  const calculateCompleteness = () => {
    let score = 20; // registered
    if (applicant?.fullName) score += 15;
    if (applicant?.phone) score += 15;
    if (applicant?.hometown) score += 15;
    if (applicant?.experience && applicant.experience !== 'No prior experience specified')
      score += 15;
    if (applicant?.profilePicture) score += 10;
    if (applicant?.cv?.fileUrl) score += 10;
    return Math.min(score, 100);
  };

  const completeness = calculateCompleteness();

  // Status counts
  const pendingCount = applications.filter((a) => a.status === 'pending').length;
  const shortlistedCount = applications.filter((a) => a.status === 'shortlisted').length;
  const hiredCount = applications.filter((a) => a.status === 'hired').length;
  const rejectedCount = applications.filter((a) => a.status === 'rejected').length;

  const hasHiredOrShortlisted = shortlistedCount > 0 || hiredCount > 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-xs text-slate-500">Loading your catering dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Applicant Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {applicant?.fullName || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-emerald-100/80 text-xs sm:text-sm max-w-xl">
            Track your catering job applications, manage your CV profile, and get selected for upcoming event shifts in Bangladesh.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition shadow-lg shadow-black/10"
          >
            <Briefcase className="w-4 h-4 text-emerald-600" />
            Explore Jobs
          </Link>
          <Link
            to="/applicant/edit-profile"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 text-white text-xs font-bold transition border border-emerald-600/50"
          >
            <User className="w-4 h-4" />
            Edit Profile & CV
          </Link>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Celebratory Alert if Shortlisted or Hired */}
      {hasHiredOrShortlisted && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-950">
                Congratulations! You have {hiredCount > 0 ? 'been hired' : 'been shortlisted'} for catering shifts!
              </p>
              <p className="text-xs text-emerald-700">
                The catering manager will reach out via phone or WhatsApp shortly. Keep your phone active.
              </p>
            </div>
          </div>
          <Link
            to="/applicant/my-applications"
            className="shrink-0 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition"
          >
            View Details
          </Link>
        </div>
      )}

      {/* Profile Completeness Meter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Profile & CV Completeness ({completeness}%)
            </h3>
            <p className="text-xs text-slate-500">
              {completeness === 100
                ? 'Your profile is fully completed and ready for top-tier hiring!'
                : 'Upload your CV and catering pictures to increase your shortlisting chances.'}
            </p>
          </div>
          {completeness < 100 && (
            <Link
              to="/applicant/edit-profile"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Complete Now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${
              completeness === 100
                ? 'bg-emerald-500'
                : completeness > 60
                ? 'bg-emerald-600'
                : 'bg-amber-500'
            }`}
            style={{ width: `${completeness}%` }}
          ></div>
        </div>
      </div>

      {/* Application Status Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-black text-slate-900">{pendingCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Shortlisted</p>
            <p className="text-2xl font-black text-slate-900">{shortlistedCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Hired</p>
            <p className="text-2xl font-black text-slate-900">{hiredCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Rejected</p>
            <p className="text-2xl font-black text-slate-900">{rejectedCount}</p>
          </div>
        </div>
      </div>

      {/* Recent Applications List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Recent Applications</h2>
            <p className="text-xs text-slate-500">Live status updates from the catering hirer</p>
          </div>
          <Link
            to="/applicant/my-applications"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            View All ({applications.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-2xl">
            <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No applications submitted yet</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Browse available event catering shifts and apply with your profile.
            </p>
            <Link
              to="/jobs"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
            >
              Browse Available Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.slice(0, 4).map((app) => (
              <div
                key={app._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition gap-4"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">{app.jobId?.title}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {app.jobId?.location}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-emerald-700">
                      {app.jobId?.salary || 'Negotiable'}
                    </span>
                    <span>•</span>
                    <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={app.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantDashboard;
