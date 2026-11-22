import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import StatusBadge from '../../components/StatusBadge';
import {
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  FileText,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Clock3,
} from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await jobService.getMyApplications();
        if (res.success) {
          setApplications(res.applications || []);
        }
      } catch (err) {
        console.warn('Error fetching applications:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            My Job Applications ({applications.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track status updates on all catering event shifts you have applied for
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
        >
          <Briefcase className="w-4 h-4" />
          Apply for More Shifts
        </Link>
      </div>

      {/* Status Explanatory Guide Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          How Application Status Works:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-600">
          <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
            <Clock3 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-800">Pending:</span>
              <p>Application is submitted and waiting for hirer review.</p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-800">Shortlisted / Hired:</span>
              <p>Hirer selected your profile! Expect a call or WhatsApp message.</p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
            <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-red-800">Rejected:</span>
              <p>Shift vacancies filled or requirements not matched.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Feed */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Retrieving your applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No applications yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            You haven't submitted any applications for upcoming catering events.
          </p>
          <Link
            to="/jobs"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
          >
            Browse Available Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {app.jobId?.jobType || 'Part-Time'}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {app.jobId?.salary || 'Negotiable'}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900">{app.jobId?.title}</h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {app.jobId?.location}
                  </span>
                  {app.jobId?.eventDate && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {app.jobId?.eventDate}
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                </div>

                {app.coverNote && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                    " {app.coverNote} "
                  </p>
                )}
              </div>

              {/* Status Section */}
              <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 hidden md:block">
                    Application Status
                  </p>
                  <StatusBadge status={app.status} />
                </div>

                {app.status === 'hired' && (
                  <span className="text-[11px] font-bold text-emerald-600">
                    🎉 Selected for Event Shift
                  </span>
                )}
                {app.status === 'shortlisted' && (
                  <span className="text-[11px] font-bold text-purple-600">
                    ⭐ Candidate Shortlisted
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
