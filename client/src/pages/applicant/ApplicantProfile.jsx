import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { applicantService } from '../../services/applicantService';
import {
  User,
  Phone,
  MessageSquare,
  MapPin,
  Briefcase,
  FileText,
  Edit3,
  Calendar,
  Image as ImageIcon,
  CheckCircle,
} from 'lucide-react';

const ApplicantProfile = () => {
  const { user, applicant, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  const normPhone = (applicant?.phone || '').replace(/[\s\-\(\)]/g, '');
  const normWhatsApp = (applicant?.whatsapp || applicant?.phone || '').replace(/[\s\-\(\)]/g, '');
  const intlWhatsApp = normWhatsApp.startsWith('88')
    ? normWhatsApp
    : normWhatsApp.startsWith('0')
    ? `88${normWhatsApp}`
    : `880${normWhatsApp}`;

  const hasCv = applicant?.cv && applicant?.cv?.fileUrl;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-extrabold text-2xl text-slate-500 shrink-0">
            {applicant?.profilePicture ? (
              <img
                src={applicant.profilePicture}
                alt={applicant.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              applicant?.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {applicant?.fullName || 'Your Name'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <MapPin className="w-3 h-3" />
                {applicant?.hometown || 'Dhaka, Bangladesh'}
              </span>
            </div>
          </div>
        </div>

        <Link
          to="/applicant/edit-profile"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
        >
          <Edit3 className="w-4 h-4" />
          Edit Profile & CV
        </Link>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Contact Information
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <p className="text-slate-400 text-[11px]">Primary Phone</p>
              <a
                href={`tel:${normPhone}`}
                className="font-bold text-slate-800 hover:text-emerald-600 flex items-center gap-1.5 mt-0.5"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {applicant?.phone || 'Not provided'}
              </a>
            </div>

            <div>
              <p className="text-slate-400 text-[11px]">WhatsApp Number</p>
              <a
                href={`https://wa.me/${intlWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 mt-0.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                {applicant?.whatsapp || applicant?.phone || 'Not provided'}
              </a>
            </div>

            <div>
              <p className="text-slate-400 text-[11px]">Hometown / City</p>
              <p className="font-semibold text-slate-800 mt-0.5">
                {applicant?.hometown || 'Dhaka'}
              </p>
            </div>
          </div>
        </div>

        {/* Experience & Skills */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Catering Experience & Skills
          </h3>

          <div>
            <p className="text-xs font-semibold text-slate-700">Work Experience:</p>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100">
              {applicant?.experience || 'No previous experience detailed yet.'}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Hospitality Skills:</p>
            <div className="flex flex-wrap gap-1.5">
              {applicant?.skills && applicant.skills.length > 0 ? (
                applicant.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No skills listed</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CV Document Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Curriculum Vitae (CV)
        </h3>

        {hasCv ? (
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-950">
                  {applicant.cv.fileName || 'Curriculum_Vitae.pdf'}
                </p>
                <p className="text-[11px] text-emerald-700">
                  {applicant.cv.size
                    ? `${(applicant.cv.size / 1024).toFixed(0)} KB • Verified document`
                    : 'Verified PDF/DOC document'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={applicantService.getDownloadCvUrl(applicant._id, false)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-xs font-bold shadow-sm transition"
              >
                Preview CV
              </a>
              <a
                href={applicantService.getDownloadCvUrl(applicant._id, true)}
                download
                className="px-3.5 py-2 bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-bold border border-emerald-300 transition"
              >
                Download
              </a>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <p className="text-xs text-slate-600">No CV document has been uploaded yet.</p>
            <Link
              to="/applicant/edit-profile"
              className="mt-2 inline-block text-xs font-bold text-emerald-600 hover:underline"
            >
              Upload your CV now →
            </Link>
          </div>
        )}
      </div>

      {/* Event Work Photos Gallery */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Past Catering & Event Work Photos
          </h3>
          <span className="text-xs text-slate-400">
            {applicant?.additionalPictures?.length || 0} / 6 photos
          </span>
        </div>

        {applicant?.additionalPictures && applicant.additionalPictures.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {applicant.additionalPictures.map((pic, idx) => (
              <div
                key={idx}
                className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group relative"
              >
                <img
                  src={pic.url}
                  alt={pic.caption || 'Catering work'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            No work photos uploaded yet. You can upload photos of yourself in uniform or serving at past catering events.
          </p>
        )}
      </div>
    </div>
  );
};

export default ApplicantProfile;
