import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { jobService } from '../../services/jobService';
import {
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const ApplyForJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { applicant, user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobService.getJobById(jobId);
        if (res.success) {
          setJob(res.job);
        }
      } catch (err) {
        setErrorMsg('Failed to load catering shift information.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const isProfileComplete = Boolean(
    applicant?.fullName && applicant?.phone && applicant?.hometown
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isProfileComplete) {
      setErrorMsg('Please complete your profile before applying.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await jobService.applyForJob(jobId, coverNote);
      if (res.success) {
        setSuccessMsg(
          'Your catering application has been submitted! Status is automatically set to Pending.'
        );
        setTimeout(() => {
          navigate('/applicant/my-applications');
        }, 2000);
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Unable to submit application. You may have already applied.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-xs text-slate-500">Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-6 sm:p-8 text-white">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-700/70 text-emerald-200 text-xs font-semibold mb-2">
            Confirm Application
          </span>
          <h1 className="text-xl sm:text-2xl font-black">{job?.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-100/90 mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              {job?.location}
            </span>
            <span>•</span>
            <span className="font-semibold text-white">{job?.salary || 'Negotiable'}</span>
            <span>•</span>
            <span>{job?.jobType}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Profile Pre-Check Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Applying with Saved Profile
              </h3>
              <Link
                to="/applicant/edit-profile"
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Edit Profile
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong className="text-slate-900">Name:</strong> {applicant?.fullName || 'Missing'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong className="text-slate-900">Phone:</strong> {applicant?.phone || 'Missing'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong className="text-slate-900">Hometown:</strong> {applicant?.hometown || 'Missing'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong className="text-slate-900">CV:</strong>{' '}
                  {applicant?.cv?.fileUrl ? (
                    <span className="text-emerald-600 font-semibold">Attached & Ready</span>
                  ) : (
                    <span className="text-amber-600 font-semibold">Not attached (Optional)</span>
                  )}
                </span>
              </div>
            </div>

            {!isProfileComplete && (
              <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
                Your profile is missing basic required details. Please{' '}
                <Link to="/applicant/edit-profile" className="font-bold underline">
                  fill your profile
                </Link>{' '}
                first.
              </div>
            )}
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="coverNote" className="block text-xs font-bold text-slate-700 mb-1">
                Note for the Hirer / Availability Details (Optional)
              </label>
              <textarea
                id="coverNote"
                name="coverNote"
                rows={3}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="E.g., I am fully available for this shift timing. I have my own white formal shirt and black banquet shoes."
              ></textarea>
              <p className="text-[11px] text-slate-400 mt-1">
                The hiring manager can review this note alongside your full profile and CV.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Back to Jobs
              </button>

              <button
                type="submit"
                disabled={submitting || !isProfileComplete}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting Application...' : 'Confirm & Apply (Status: Pending)'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyForJob;
