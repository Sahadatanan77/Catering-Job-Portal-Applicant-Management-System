import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import Sidebar from '../../components/Sidebar';
import { PlusCircle, Save, Briefcase, MapPin, Calendar, Clock, ArrowLeft } from 'lucide-react';

const CreateJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: 'Dhanmondi, Dhaka',
    salary: '1,200 BDT / Day + Meal',
    jobType: 'Part-Time',
    vacancies: 6,
    eventDate: 'Upcoming Friday (05:00 PM - 11:30 PM)',
    shiftTimings: 'Evening Shift (6.5 hours)',
    requirements:
      'Pleasant grooming & polite presentation\nKnowledge of table etiquette & buffet refills\nPunctual and cooperative team player',
    status: 'active',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      jobService
        .getJobById(id)
        .then((res) => {
          if (res.success && res.job) {
            const j = res.job;
            setFormData({
              title: j.title || '',
              description: j.description || '',
              location: j.location || '',
              salary: j.salary || '',
              jobType: j.jobType || 'Part-Time',
              vacancies: j.vacancies || 5,
              eventDate: j.eventDate || '',
              shiftTimings: j.shiftTimings || '',
              requirements: Array.isArray(j.requirements)
                ? j.requirements.join('\n')
                : j.requirements || '',
              status: j.status || 'active',
            });
          }
        })
        .finally(() => setFetching(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await jobService.updateJob(id, formData);
      } else {
        await jobService.createJob(formData);
      }
      navigate('/hirer/manage-jobs');
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving catering job');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-12 text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Loading shift details...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => navigate('/hirer/manage-jobs')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isEditing ? 'Edit Catering Shift' : 'Post New Catering Event Shift'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Publish event requirements to receive applications from registered catering workers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-xs font-bold text-slate-700 mb-1">
                Job Shift Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="E.g., Part-Time Buffet Banquet Server"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-xs font-bold text-slate-700 mb-1">
                  Location / Hall Venue <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="E.g., Dhanmondi Club / Gulshan Hotel"
                />
              </div>

              <div>
                <label htmlFor="salary" className="block text-xs font-bold text-slate-700 mb-1">
                  Remuneration / Daily Rate
                </label>
                <input
                  id="salary"
                  name="salary"
                  type="text"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="E.g., 1,500 BDT / Day + Dinner"
                />
              </div>

              <div>
                <label htmlFor="jobType" className="block text-xs font-bold text-slate-700 mb-1">
                  Shift Type
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                >
                  <option value="Part-Time">Part-Time</option>
                  <option value="Event-Based">Event-Based</option>
                  <option value="Shift-Based">Shift-Based</option>
                  <option value="Full-Time">Full-Time</option>
                </select>
              </div>

              <div>
                <label htmlFor="vacancies" className="block text-xs font-bold text-slate-700 mb-1">
                  Staff Required (Vacancies)
                </label>
                <input
                  id="vacancies"
                  name="vacancies"
                  type="number"
                  min={1}
                  value={formData.vacancies}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="eventDate" className="block text-xs font-bold text-slate-700 mb-1">
                  Event Date
                </label>
                <input
                  id="eventDate"
                  name="eventDate"
                  type="text"
                  value={formData.eventDate}
                  onChange={handleChange}
                  placeholder="E.g., Friday, 28 Nov 2026"
                />
              </div>

              <div>
                <label htmlFor="shiftTimings" className="block text-xs font-bold text-slate-700 mb-1">
                  Shift Timings
                </label>
                <input
                  id="shiftTimings"
                  name="shiftTimings"
                  type="text"
                  value={formData.shiftTimings}
                  onChange={handleChange}
                  placeholder="E.g., 05:00 PM - 11:30 PM"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-bold text-slate-700 mb-1">
                Job Responsibilities & Scope <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe serving responsibilities, venue expectations, and meal arrangements..."
              ></textarea>
            </div>

            <div>
              <label htmlFor="requirements" className="block text-xs font-bold text-slate-700 mb-1">
                Candidate Requirements (One per line)
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows={3}
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Pleasant grooming&#10;Prior catering experience&#10;Formal shoes required"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/hirer/manage-jobs')}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : isEditing ? 'Update Job Posting' : 'Publish Job Shift'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateJob;
