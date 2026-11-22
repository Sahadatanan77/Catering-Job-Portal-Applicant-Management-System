import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Utensils,
  Briefcase,
  User,
  LogOut,
  Menu,
  X,
  FileText,
  LayoutDashboard,
  Users,
  PlusCircle,
  ChevronDown,
} from 'lucide-react';

const Navbar = () => {
  const { user, applicant, isAuthenticated, isApplicant, isHirer, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1">
                Catering<span className="text-emerald-600">Hub</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                Job & Staff Portal
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            <Link
              to="/jobs"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/jobs') ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Available Jobs
            </Link>

            {/* Applicant Navigation */}
            {isAuthenticated && isApplicant && (
              <>
                <Link
                  to="/applicant/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/applicant/dashboard')
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Dashboard
                </Link>
                <Link
                  to="/applicant/my-applications"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/applicant/my-applications')
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Applications
                </Link>
                <Link
                  to="/applicant/profile"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/applicant/profile')
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Profile & CV
                </Link>
              </>
            )}

            {/* Hirer Navigation */}
            {isAuthenticated && isHirer && (
              <>
                <Link
                  to="/hirer/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/hirer/dashboard')
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Hirer Dashboard
                </Link>
                <Link
                  to="/hirer/applicants"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/hirer/applicants')
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  All Applicants
                </Link>
                <Link
                  to="/hirer/manage-jobs"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/hirer/manage-jobs')
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Manage Jobs
                </Link>
                <Link
                  to="/hirer/create-job"
                  className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white shadow hover:bg-emerald-700 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Post Job
                </Link>
              </>
            )}
          </div>

          {/* Desktop Right Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/30 transition"
                >
                  Apply as Catering Staff
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition border border-slate-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center overflow-hidden">
                    {applicant?.profilePicture ? (
                      <img
                        src={applicant.profilePicture}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.email?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-900 leading-tight">
                      {applicant?.fullName || user?.email?.split('@')[0]}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-medium capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-xs font-semibold text-slate-800 truncate">{user?.email}</p>
                    </div>

                    {isApplicant && (
                      <>
                        <Link
                          to="/applicant/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Dashboard
                        </Link>
                        <Link
                          to="/applicant/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          Profile & CV
                        </Link>
                        <Link
                          to="/applicant/my-applications"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <FileText className="w-4 h-4 text-slate-400" />
                          My Applications
                        </Link>
                      </>
                    )}

                    {isHirer && (
                      <>
                        <Link
                          to="/hirer/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Admin Dashboard
                        </Link>
                        <Link
                          to="/hirer/applicants"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Users className="w-4 h-4 text-slate-400" />
                          Applicant Pool
                        </Link>
                        <Link
                          to="/hirer/manage-jobs"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          Manage Jobs
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Available Jobs
          </Link>

          {isAuthenticated && isApplicant && (
            <>
              <Link
                to="/applicant/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                My Dashboard
              </Link>
              <Link
                to="/applicant/my-applications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                My Applications
              </Link>
              <Link
                to="/applicant/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Profile & CV
              </Link>
            </>
          )}

          {isAuthenticated && isHirer && (
            <>
              <Link
                to="/hirer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Hirer Dashboard
              </Link>
              <Link
                to="/hirer/applicants"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                All Applicants
              </Link>
              <Link
                to="/hirer/manage-jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Manage Jobs
              </Link>
              <Link
                to="/hirer/create-job"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-emerald-600 hover:bg-emerald-50"
              >
                + Post New Catering Job
              </Link>
            </>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Apply as Catering Staff
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
