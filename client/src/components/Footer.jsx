import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Phone, Mail, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="col-span-1 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Catering<span className="text-emerald-400">Hub</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bangladesh's dedicated recruitment platform connecting reliable event catering staff, banquet servers, and culinary stewards with premier catering services and wedding planners.
            </p>
          </div>

          {/* Quick links for Applicants */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              For Applicants
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/jobs" className="hover:text-emerald-400 transition">
                  Browse Catering Jobs
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition">
                  Create Applicant Profile
                </Link>
              </li>
              <li>
                <Link to="/applicant/profile" className="hover:text-emerald-400 transition">
                  Upload CV & Photos
                </Link>
              </li>
              <li>
                <Link to="/applicant/my-applications" className="hover:text-emerald-400 transition">
                  Track Application Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick links for Hirers */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              For Catering Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition">
                  Hirer / Admin Login
                </Link>
              </li>
              <li>
                <Link to="/hirer/dashboard" className="hover:text-emerald-400 transition">
                  Recruitment Dashboard
                </Link>
              </li>
              <li>
                <Link to="/hirer/applicants" className="hover:text-emerald-400 transition">
                  Verified Candidate Pool
                </Link>
              </li>
              <li>
                <Link to="/hirer/create-job" className="hover:text-emerald-400 transition">
                  Post Event Catering Shift
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Contact & Support
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+880 1XXXXXXXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>contact@cateringportal.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} CateringHub. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with modern web standards & security
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
