import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageSquare, FileText, ChevronRight, Briefcase } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { applicantService } from '../services/applicantService';

const ApplicantCard = ({ applicant, onStatusChange }) => {
  const normPhone = (applicant.phone || '').replace(/[\s\-\(\)]/g, '');
  const whatsAppNumber = (applicant.whatsapp || applicant.phone || '').replace(/[\s\-\(\)]/g, '');
  const intlWhatsApp = whatsAppNumber.startsWith('88')
    ? whatsAppNumber
    : whatsAppNumber.startsWith('0')
    ? `88${whatsAppNumber}`
    : `880${whatsAppNumber}`;

  const hasCv = applicant.cv && applicant.cv.fileUrl;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-600 text-base">
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
              <h3 className="font-bold text-slate-900 text-base leading-snug">
                {applicant.fullName}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {applicant.hometown || 'Dhaka'}
              </p>
            </div>
          </div>

          {applicant.latestStatus && (
            <StatusBadge status={applicant.latestStatus} size="sm" />
          )}
        </div>

        <div className="space-y-2 mb-4 text-xs text-slate-600">
          <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p className="line-clamp-2 leading-relaxed">
              <span className="font-semibold text-slate-700">Exp: </span>
              {applicant.experience || 'Fresh catering applicant'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`tel:${normPhone}`}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition"
            >
              <Phone className="w-3 h-3 text-slate-500" />
              Call
            </a>
            <a
              href={`https://wa.me/${intlWhatsApp}?text=${encodeURIComponent(
                `Hello ${applicant.fullName}, we are contacting you regarding catering job opportunities.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium transition"
            >
              <MessageSquare className="w-3 h-3 text-emerald-600" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        {hasCv ? (
          <a
            href={applicantService.getDownloadCvUrl(applicant._id)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-700 font-semibold hover:underline"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            Download CV
          </a>
        ) : (
          <span className="text-slate-400 text-[11px] italic">No CV uploaded</span>
        )}

        <Link
          to={`/hirer/applicants/${applicant._id}`}
          className="inline-flex items-center gap-1 text-slate-700 hover:text-emerald-700 font-semibold transition"
        >
          Full Profile
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default ApplicantCard;
