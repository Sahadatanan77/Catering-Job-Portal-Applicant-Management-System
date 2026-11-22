import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';
import Sidebar from '../../components/Sidebar';
import ApplicantTable from '../../components/ApplicantTable';
import { XCircle, RefreshCw } from 'lucide-react';

const RejectedApplicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRejected = async () => {
    setLoading(true);
    try {
      const res = await jobService.getAllApplications({ status: 'rejected' });
      if (res.success) {
        setApplications(res.applications || []);
      }
    } catch (err) {
      console.warn('Error fetching rejected:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRejected();
  }, []);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await jobService.updateApplicationStatus(appId, newStatus);
      fetchRejected();
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
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Rejected Applications ({applications.length})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Applications marked as rejected. You can reconsider or move candidates back to Shortlisted if slots open up.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Loading rejected applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <XCircle className="w-10 h-10 text-red-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No rejected applications</h3>
            <p className="text-xs text-slate-500 mt-1">
              No catering applications currently sit in the rejected category.
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

export default RejectedApplicants;
