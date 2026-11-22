import React, { useState, useEffect } from 'react';
import { applicantService } from '../../services/applicantService';
import Sidebar from '../../components/Sidebar';
import ApplicantTable from '../../components/ApplicantTable';
import ApplicantCard from '../../components/ApplicantCard';
import {
  Users,
  Search,
  Filter,
  Grid,
  List,
  MapPin,
  FileCheck,
  RefreshCw,
} from 'lucide-react';

const AllApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [hometownFilter, setHometownFilter] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'card'

  const bangladeshiDivisions = [
    'Dhaka',
    'Chittagong',
    'Sylhet',
    'Rajshahi',
    'Khulna',
    'Barisal',
    'Rangpur',
    'Mymensingh',
    'Gazipur',
    'Narayanganj',
    'Cumilla',
  ];

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await applicantService.getAllApplicants({
        search,
        hometown: hometownFilter,
      });
      if (res.success) {
        setApplicants(res.applicants || []);
      }
    } catch (err) {
      console.warn('Error fetching applicants:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [hometownFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplicants();
  };

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Applicant Pool ({applicants.length})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Browse candidate credentials, download verified CVs, and initiate WhatsApp interviews
            </p>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-2">
            <div className="p-1 bg-slate-100 rounded-xl flex items-center">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
                Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                  viewMode === 'card' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
                title="Grid Cards"
              >
                <Grid className="w-4 h-4" />
                Cards
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name, phone, skills, or experience..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={hometownFilter}
              onChange={(e) => setHometownFilter(e.target.value)}
              className="py-2 text-xs rounded-xl w-full sm:w-auto"
            >
              <option value="">All Hometowns</option>
              {bangladeshiDivisions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={fetchApplicants}
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Searching applicants...</p>
          </div>
        ) : viewMode === 'table' ? (
          <ApplicantTable applicants={applicants} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {applicants.map((app) => (
              <ApplicantCard key={app._id} applicant={app} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllApplicants;
