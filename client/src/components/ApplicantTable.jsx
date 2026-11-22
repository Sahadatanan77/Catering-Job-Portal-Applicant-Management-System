import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Phone,
  MessageSquare,
  Eye,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { applicantService } from '../services/applicantService';

const ApplicantTable = ({
  applicants = [],
  onUpdateStatus,
  showApplicationJob = false,
}) => {
  if (applicants.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">No applicants found</h3>
        <p className="text-xs text-slate-500 mt-1">
          Try clearing your search query or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th scope="col" className="px-5 py-3.5">
                Applicant
              </th>
              <th scope="col" className="px-4 py-3.5">
                Contact & WhatsApp
              </th>
              <th scope="col" className="px-4 py-3.5">
                Hometown
              </th>
              <th scope="col" className="px-4 py-3.5">
                Work Experience
              </th>
              {showApplicationJob && (
                <th scope="col" className="px-4 py-3.5">
                  Applied Shift
                </th>
              )}
              <th scope="col" className="px-4 py-3.5">
                CV Document
              </th>
              <th scope="col" className="px-4 py-3.5">
                Status
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {applicants.map((item) => {
              // Can accept direct applicant object or application object with populated applicantId
              const applicant = item.applicantId || item;
              const application = item.status ? item : null;
              const currentStatus = application ? application.status : applicant.latestStatus;

              const normPhone = (applicant.phone || '').replace(/[\s\-\(\)]/g, '');
              const normWhatsApp = (applicant.whatsapp || applicant.phone || '').replace(
                /[\s\-\(\)]/g,
                ''
              );
              const intlWhatsApp = normWhatsApp.startsWith('88')
                ? normWhatsApp
                : normWhatsApp.startsWith('0')
                ? `88${normWhatsApp}`
                : `880${normWhatsApp}`;

              const hasCv = applicant.cv && applicant.cv.fileUrl;

              return (
                <tr
                  key={item._id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Applicant Name & Pic */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-600">
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
                        <Link
                          to={`/hirer/applicants/${applicant._id}`}
                          className="font-bold text-slate-900 hover:text-emerald-600 transition"
                        >
                          {applicant.fullName}
                        </Link>
                        <p className="text-[11px] text-slate-400">
                          {applicant.userId?.email || 'Registered applicant'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <a
                        href={`tel:${normPhone}`}
                        className="flex items-center gap-1.5 font-medium text-slate-700 hover:text-emerald-600"
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        {applicant.phone || 'N/A'}
                      </a>
                      <a
                        href={`https://wa.me/${intlWhatsApp}?text=${encodeURIComponent(
                          `Hello ${applicant.fullName}, contacting from CateringHub regarding event job shifts.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Chat on WhatsApp
                      </a>
                    </div>
                  </td>

                  {/* Hometown */}
                  <td className="px-4 py-4 text-slate-700 font-medium">
                    {applicant.hometown || 'Dhaka'}
                  </td>

                  {/* Experience */}
                  <td className="px-4 py-4 max-w-xs">
                    <p className="text-slate-600 line-clamp-2 leading-relaxed">
                      {applicant.experience || 'Fresh catering applicant'}
                    </p>
                  </td>

                  {/* Optional Applied Job Title */}
                  {showApplicationJob && (
                    <td className="px-4 py-4 text-slate-800 font-medium">
                      {item.jobId?.title || 'General Pool'}
                    </td>
                  )}

                  {/* CV Download */}
                  <td className="px-4 py-4">
                    {hasCv ? (
                      <a
                        href={applicantService.getDownloadCvUrl(applicant._id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition border border-emerald-200/50"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        Download CV
                      </a>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">No CV</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <StatusBadge status={currentStatus} size="sm" />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/hirer/applicants/${applicant._id}`}
                        title="View Full Profile"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {onUpdateStatus && application && (
                        <>
                          {currentStatus !== 'shortlisted' && (
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(application._id, 'shortlisted')}
                              title="Shortlist Candidate"
                              className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {currentStatus !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(application._id, 'rejected')}
                              title="Reject Application"
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicantTable;
