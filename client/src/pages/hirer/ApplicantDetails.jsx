import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicantService } from '../../services/applicantService';
import { jobService } from '../../services/jobService';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import {
  User,
  Phone,
  MessageSquare,
  MapPin,
  Briefcase,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Send,
} from 'lucide-react';

const ApplicantDetails = () => {
  const { id } = useParams();
  const [applicant, setApplicant] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const fetchDetails = async () => {
    try {
      const res = await applicantService.getApplicantById(id);
      if (res.success) {
        setApplicant(res.applicant);
        setApplications(res.applications || []);
      }
    } catch (err) {
      console.warn('Error fetching applicant details:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleStatusChange = async (appId, newStatus) => {
    setStatusUpdating(true);
    setFeedbackMsg('');
    try {
      const res = await jobService.updateApplicationStatus(appId, newStatus);
      if (res.success) {
        setFeedbackMsg(`Application status updated to ${newStatus.toUpperCase()}`);
        await fetchDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating application status');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-12 text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Loading applicant file...</p>
        </main>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-12 text-center">
          <p className="text-sm font-bold text-slate-800">Applicant not found.</p>
          <Link
            to="/hirer/applicants"
            className="mt-3 inline-block text-xs font-semibold text-emerald-600 underline"
          >
            ← Return to Applicants
          </Link>
        </main>
      </div>
    );
  }

  const normPhone = (applicant.phone || '').replace(/[\s\-\(\)]/g, '');
  const normWhatsApp = (applicant.whatsapp || applicant.phone || '').replace(/[\s\-\(\)]/g, '');
  const intlWhatsApp = normWhatsApp.startsWith('88')
    ? normWhatsApp
    : normWhatsApp.startsWith('0')
    ? `88${normWhatsApp}`
    : `880${normWhatsApp}`;

  const hasCv = applicant.cv && applicant.cv.fileUrl;

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-6xl mx-auto">
        {/* Back Link */}
        <Link
          to="/hirer/applicants"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Applicant Pool
        </Link>

        {feedbackMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-black text-2xl text-slate-500 shrink-0">
              {applicant.profilePicture ? (
                <img
                  src={applicant.profilePicture}
                  alt={applicant.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                applicant.fullName?.charAt(0) || 'A'
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {applicant.fullName}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Applicant
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{applicant.userId?.email}</p>
              <p className="text-xs text-slate-600 flex items-center gap-1 mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {applicant.hometown || 'Dhaka, Bangladesh'}
              </p>
            </div>
          </div>

          {/* Quick Contact Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={`tel:${normPhone}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
            >
              <Phone className="w-4 h-4 text-slate-500" />
              Call ({applicant.phone})
            </a>
            <a
              href={`https://wa.me/${intlWhatsApp}?text=${encodeURIComponent(
                `Hello ${applicant.fullName}, I am reviewing your application on CateringHub. Are you available for catering shifts this weekend?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/30 transition"
            >
              <MessageSquare className="w-4 h-4" />
              Direct WhatsApp Chat
            </a>
          </div>
        </div>

        {/* Experience & CV Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Experience & Qualifications
            </h3>

            <div>
              <p className="text-xs font-semibold text-slate-700">Catering Background:</p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                {applicant.experience || 'No previous experience description provided.'}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Service Skills:</p>
              <div className="flex flex-wrap gap-1.5">
                {applicant.skills && applicant.skills.length > 0 ? (
                  applicant.skills.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                    >
                      ✓ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">None listed</span>
                )}
              </div>
            </div>
          </div>

          {/* CV Document Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Applicant CV Document
              </h3>

              {hasCv ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <span className="truncate">{applicant.cv.fileName || 'Applicant_CV.pdf'}</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Uploaded on{' '}
                    {applicant.cv.uploadedAt
                      ? new Date(applicant.cv.uploadedAt).toLocaleDateString()
                      : 'Recently'}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={applicantService.getDownloadCvUrl(applicant._id, false)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-xs font-bold shadow-sm transition"
                    >
                      <FileText className="w-4 h-4" />
                      Preview CV
                    </a>
                    <a
                      href={applicantService.getDownloadCvUrl(applicant._id, true)}
                      download
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold border border-emerald-300 transition"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <p className="text-xs text-slate-500 italic">No CV document uploaded.</p>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400 text-center">
              Secured download link through protected server route
            </div>
          </div>
        </div>

        {/* Event Work Photos Gallery */}
        {applicant.additionalPictures && applicant.additionalPictures.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Work & Uniform Photos ({applicant.additionalPictures.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {applicant.additionalPictures.map((pic, idx) => (
                <div
                  key={idx}
                  className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200"
                >
                  <img
                    src={pic.url}
                    alt="Work photo"
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications submitted by this applicant */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Applications Submitted by {applicant.fullName} ({applications.length})
          </h3>

          {applications.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              Candidate is in general pool; has not applied to a specific shift posting yet.
            </p>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl border border-slate-200 hover:bg-slate-50 gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">{app.jobId?.title}</h4>
                    <p className="text-xs text-slate-500">
                      Applied on {new Date(app.appliedAt).toLocaleDateString()} • {app.jobId?.location}
                    </p>
                    {app.coverNote && (
                      <p className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100 italic mt-1">
                        " {app.coverNote} "
                      </p>
                    )}
                  </div>

                  {/* Status Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <StatusBadge status={app.status} />

                    <div className="flex items-center gap-1.5 ml-2">
                      <button
                        type="button"
                        disabled={statusUpdating}
                        onClick={() => handleStatusChange(app._id, 'shortlisted')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          app.status === 'shortlisted'
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                        }`}
                      >
                        Shortlist
                      </button>

                      <button
                        type="button"
                        disabled={statusUpdating}
                        onClick={() => handleStatusChange(app._id, 'hired')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          app.status === 'hired'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        Hire / Accept
                      </button>

                      <button
                        type="button"
                        disabled={statusUpdating}
                        onClick={() => handleStatusChange(app._id, 'rejected')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          app.status === 'rejected'
                            ? 'bg-red-600 text-white'
                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ApplicantDetails;
