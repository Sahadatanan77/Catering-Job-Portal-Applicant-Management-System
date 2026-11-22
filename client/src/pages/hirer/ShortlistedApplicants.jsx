import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';
import Sidebar from '../../components/Sidebar';
import ApplicantTable from '../../components/ApplicantTable';
import { CheckCircle2, MessageSquare, Phone, Users } from 'lucide-react';

const ShortlistedApplicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShortlisted = async () => {
    setLoading(true);
    try {
      const res = await jobService.getAllApplications({ status: 'shortlisted' });
      if (res.success) {
        setApplications(res.applications || []);
      }
    } catch (err) {
      console.warn('Error fetching shortlisted:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlisted();
  }, []);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await jobService.updateApplicationStatus(appId, newStatus);
      fetchShortlisted();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Shortlisted Staff ({applications.length})
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                Ready for Event Shift
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Top-evaluated catering applicants ready for shift assignment or contract confirmation
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Retrieving shortlisted staff...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-purple-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No candidates shortlisted yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Review new applications from the dashboard and click "Shortlist" to curate your event crew.
            </p>
          </div>
        ) : (
          <ApplicantTable
            applicants={applications}
            onUpdateStatus={handleUpdateStatus}
            showApplicationJob={true}
          />
        )}
      </main>
    </div>
  );
};

export default ShortlistedApplicants;
