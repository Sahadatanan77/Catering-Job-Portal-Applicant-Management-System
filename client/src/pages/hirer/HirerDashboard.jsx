import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import Sidebar from '../../components/Sidebar';
import ApplicantTable from '../../components/ApplicantTable';
import {
  Users,
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  UserCheck,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

const HirerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await jobService.getDashboardStats();
      if (res.success) {
        setStats(res.stats);
        setRecentApplications(res.recentApplications || []);
      }
    } catch (err) {
      console.warn('Dashboard stats error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await jobService.updateApplicationStatus(appId, newStatus);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Recruitment Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Oversee catering candidates, CV submissions, and event hiring operations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/hirer/create-job"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition"
            >
              <PlusCircle className="w-4 h-4" />
              Post Catering Shift
            </Link>
          </div>
        </div>

        {/* 6 Key Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Applicants */}
          <Link
            to="/hirer/applicants"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Applicants
              </span>
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">
              {loading ? '...' : stats?.totalApplicants || 0}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              Registered candidate pool <ArrowRight className="w-3 h-3" />
            </p>
          </Link>

          {/* Card 2: New / Pending Applications */}
          <Link
            to="/hirer/applicants"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-300 transition group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pending Review
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-amber-600">
              {loading ? '...' : stats?.pendingApplications || 0}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Awaiting your evaluation</p>
          </Link>

          {/* Card 3: Shortlisted Staff */}
          <Link
            to="/hirer/shortlisted"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-300 transition group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Shortlisted / Hired
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-purple-700">
              {loading
                ? '...'
                : (stats?.shortlistedApplications || 0) + (stats?.hiredApplications || 0)}
            </p>
            <p className="text-[11px] text-purple-600 font-semibold mt-1">
              {stats?.hiredApplications || 0} confirmed hired
            </p>
          </Link>

          {/* Card 4: Active Catering Jobs */}
          <Link
            to="/hirer/manage-jobs"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Shifts
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">
              {loading ? '...' : stats?.activeJobs || 0}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Out of {stats?.totalJobs || 0} total postings
            </p>
          </Link>
        </div>

        {/* Recent Applications Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Applications Received</h2>
              <p className="text-xs text-slate-500">
                Latest candidate submissions with CV and contact info
              </p>
            </div>
            <Link
              to="/hirer/applicants"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View Full Pool <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <ApplicantTable
            applicants={recentApplications}
            onUpdateStatus={handleUpdateStatus}
            showApplicationJob={true}
          />
        </div>
      </main>
    </div>
  );
};

export default HirerDashboard;
