import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../hooks/useAuth';
import {
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  Users,
  ChevronRight,
  Filter,
} from 'lucide-react';

const AvailableJobs = () => {
  const { isAuthenticated, isApplicant } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchJobs();
    if (isAuthenticated && isApplicant) {
      jobService
        .getMyApplications()
        .then((res) => {
          if (res.success) setMyApplications(res.applications || []);
        })
        .catch(() => {});
    }
  }, [isAuthenticated, isApplicant]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getJobs({
        search,
        location: locationFilter,
        jobType: typeFilter,
      });
      if (res.success) {
        setJobs(res.jobs || []);
      }
    } catch (err) {
      console.warn('Error fetching jobs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const isAlreadyApplied = (jobId) => {
    return myApplications.some((a) => a.jobId?._id === jobId || a.jobId === jobId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
            Part-Time & Event Catering Shifts
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Find Catering Shifts in Dhaka & Major Cities
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Explore active openings for wedding banquets, corporate gala events, VIP service stewards, and culinary helpers.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="pt-2 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by job title, location, venue..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/30 shrink-0"
            >
              Search Shifts
            </button>
          </form>
        </div>

        {/* Filters */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-700/60 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            Filters:
          </div>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
            }}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5"
          >
            <option value="">All Job Types</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Event-Based">Event-Based</option>
            <option value="Full-Time">Full-Time</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => {
              setLocationFilter(e.target.value);
            }}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5"
          >
            <option value="">All Locations</option>
            <option value="Dhanmondi">Dhanmondi, Dhaka</option>
            <option value="Gulshan">Gulshan / Banani, Dhaka</option>
            <option value="Uttara">Uttara, Dhaka</option>
            <option value="Mirpur">Mirpur, Dhaka</option>
          </select>

          {(search || typeFilter || locationFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setTypeFilter('');
                setLocationFilter('');
              }}
              className="text-emerald-400 hover:underline text-xs ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Jobs Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Available Catering Openings ({jobs.length})
          </h2>
          <span className="text-xs text-slate-500">Updated in real-time</span>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Finding available catering shifts...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No matching shifts found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search criteria or check back soon for new weekend events.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {jobs.map((job) => {
              const applied = isAlreadyApplied(job._id);

              return (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                        {job.jobType || 'Part-Time'}
                      </span>
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {job.salary || 'Negotiable'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base leading-snug mb-2">
                      {job.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {job.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-500 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-700">{job.location}</span>
                      </div>
                      {job.eventDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{job.eventDate}</span>
                        </div>
                      )}
                      {job.shiftTimings && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{job.shiftTimings}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{job.vacancies || 5} staff members needed</span>
                      </div>
                    </div>

                    {job.requirements && job.requirements.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.requirements.slice(0, 3).map((req, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                          >
                            ✓ {req}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>

                    {applied ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Applied
                      </span>
                    ) : isAuthenticated && isApplicant ? (
                      <Link
                        to={`/applicant/apply/${job._id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition"
                      >
                        Apply for Shift
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                      >
                        Sign in to Apply
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableJobs;
