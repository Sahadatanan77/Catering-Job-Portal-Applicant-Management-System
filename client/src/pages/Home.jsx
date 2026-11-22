import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { useAuth } from '../hooks/useAuth';
import {
  Utensils,
  Briefcase,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Phone,
  MessageSquare,
  FileText,
  Star,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated, isApplicant, isHirer } = useAuth();
  const [featuredJobs, setFeaturedJobs] = useState([]);

  useEffect(() => {
    jobService
      .getJobs()
      .then((res) => {
        if (res.success) {
          setFeaturedJobs((res.jobs || []).slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Bangladesh's Dedicated Catering Recruitment Platform
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              Connecting Quality Catering Staff with Premier Events
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Find flexible part-time catering jobs at wedding receptions, corporate banquets, and VIP galas. Submit your profile and CV once, apply to multiple shifts, and track your hiring status in real-time.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 transition transform hover:-translate-y-0.5"
                  >
                    Apply as Catering Staff
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-sm font-bold border border-slate-700 transition"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Hirer / Admin Login
                  </Link>
                </>
              ) : isApplicant ? (
                <Link
                  to="/applicant/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-lg transition"
                >
                  Go to My Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to="/hirer/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-lg transition"
                >
                  Hirer Admin Panel
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Quick Stats Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs">
              <div>
                <p className="text-2xl font-black text-emerald-400">100%</p>
                <p className="text-slate-400 mt-0.5">Verified BD Numbers</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-400">1-Click</p>
                <p className="text-slate-400 mt-0.5">Profile Reusable Apply</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-400">Instant</p>
                <p className="text-slate-400 mt-0.5">WhatsApp Recruitment</p>
              </div>
            </div>
          </div>

          {/* Right Floating Card Illustration */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Live Shift Preview
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-md text-[10px] font-bold">
                  Active Hiring
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-white text-lg">
                  Part-Time Buffet Banquet Server
                </h3>
                <p className="text-xs text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Dhanmondi Club Convention, Dhaka
                </p>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-2xl border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Shift Date:</span>
                  <span className="font-semibold text-white">Friday, 05:00 PM</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Remuneration:</span>
                  <span className="font-bold text-emerald-400">1,200 BDT + Dinner</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Status:</span>
                  <span className="text-amber-400 font-semibold">Automatic Pending → Review</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/jobs"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition"
                >
                  Explore All Available Shifts
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Audiences Feature Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Designed for Both Catering Staff & Event Hirers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Streamlined workflow from registration and CV uploading to status tracking and WhatsApp communication
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: For Applicants */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Utensils className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-slate-900">For Job Applicants</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Looking for weekend or evening shifts? Register once, store your profile information, and apply to catering opportunities without retyping your data.
            </p>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>One-Time Profile Setup:</strong> Save Full Name, verified phone, hometown, experience, profile picture, and CV.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>1-Click Shift Application:</strong> Apply to multiple catering events without repeating data entry.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Live Status Tracking:</strong> Track whether your shift application is Pending, Shortlisted, or Hired in real-time.
                </span>
              </li>
            </ul>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-2"
            >
              Register as Catering Staff →
            </Link>
          </div>

          {/* Card 2: For Hirers */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-slate-900">For Catering Hirers & Managers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Equip your catering business with an integrated recruitment command center. Securely review applicants, verify qualifications, and manage shift rosters.
            </p>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Complete Applicant Dossier:</strong> Inspect candidate work history, photo gallery, and download CVs securely.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Direct WhatsApp Outreach:</strong> Single click to launch WhatsApp chat with pre-filled candidate message.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Status Management:</strong> Instantly update application status from Pending to Shortlisted, Hired, or Rejected.
                </span>
              </li>
            </ul>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 pt-2"
            >
              Access Hirer Dashboard →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Shifts Section */}
      {featuredJobs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Featured Catering Shifts
              </h2>
              <p className="text-xs text-slate-500">Upcoming weekend and event banquets in Dhaka</p>
            </div>

            <Link
              to="/jobs"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Browse All Shifts <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featuredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {job.jobType}
                    </span>
                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">
                      {job.salary}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mb-1.5">{job.title}</h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {job.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {job.location}
                    </span>
                    {job.eventDate && (
                      <>
                        <span>•</span>
                        <span>{job.eventDate}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {job.vacancies || 5} openings remaining
                  </span>
                  <Link
                    to={isAuthenticated ? `/applicant/apply/${job._id}` : '/login'}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
                  >
                    Apply Now
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Call to action footer banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-black">
              Ready to Join Dhaka's Best Catering Crew?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100">
              Create your profile in 2 minutes and start receiving event shift opportunities.
            </p>
          </div>
          <Link
            to="/register"
            className="px-6 py-3.5 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 text-sm font-extrabold shadow-lg shrink-0 transition"
          >
            Register Now for Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
