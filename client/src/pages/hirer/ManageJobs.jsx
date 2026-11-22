import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import Sidebar from '../../components/Sidebar';
import {
  Briefcase,
  PlusCircle,
  MapPin,
  Calendar,
  Users,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getJobs();
      if (res.success) {
        setJobs(res.jobs || []);
      }
    } catch (err) {
      console.warn('Error loading jobs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (job) => {
    const nextStatus = job.status === 'active' ? 'inactive' : 'active';
    try {
      await jobService.updateJob(job._id, { status: nextStatus });
      fetchJobs();
    } catch (err) {
      alert('Error updating job status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this catering job posting?')) return;
    try {
      await jobService.deleteJob(id);
      fetchJobs();
    } catch (err) {
      alert('Error deleting job');
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Manage Catering Jobs ({jobs.length})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Create, modify, activate, or pause catering shift postings across Dhaka
            </p>
          </div>

          <Link
            to="/hirer/create-job"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Shift
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Loading postings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No catering jobs posted yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Post an event shift to start receiving applications from qualified catering staff.
            </p>
            <Link
              to="/hirer/create-job"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              Post First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        job.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {job.status === 'active' ? 'Active & Accepting' : 'Paused / Inactive'}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{job.salary}</span>
                    <span className="text-xs text-slate-400">• {job.jobType}</span>
                  </div>

                  <h3 className="text-base font-black text-slate-900">{job.title}</h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    {job.eventDate && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {job.eventDate}
                        </span>
                      </>
                    )}
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      {job.applicationsCount || 0} applications received
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(job)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      job.status === 'active'
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {job.status === 'active' ? 'Pause Shift' : 'Activate'}
                  </button>

                  <Link
                    to={`/hirer/edit-job/${job._id}`}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    title="Edit Job"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(job._id)}
                    className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageJobs;
