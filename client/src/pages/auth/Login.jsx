import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Utensils, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [roleTab, setRoleTab] = useState('applicant'); // 'applicant' | 'hirer'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if redirected from expired session
  const queryParams = new URLSearchParams(location.search);
  const isExpired = queryParams.get('expired');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login({
        email: formData.email,
        password: formData.password,
        expectedRole: roleTab,
      });

      if (res.success) {
        if (res.user.role === 'hirer') {
          navigate('/hirer/dashboard');
        } else {
          navigate('/applicant/dashboard');
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Demo account quick fill
  const fillDemo = (type) => {
    if (type === 'hirer') {
      setRoleTab('hirer');
      setFormData({
        email: 'admin@cateringportal.com',
        password: 'Admin@12345',
      });
    } else {
      setRoleTab('applicant');
      setFormData({
        email: 'applicant1@cateringportal.com',
        password: 'Password@123',
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 mb-3">
            <Utensils className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to Catering<span className="text-emerald-600">Hub</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your catering applications or recruiter dashboard
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setRoleTab('applicant');
              setError('');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${roleTab === 'applicant'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Applicant
          </button>
          <button
            type="button"
            onClick={() => {
              setRoleTab('hirer');
              setError('');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${roleTab === 'hirer'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Hirer / Admin
          </button>
        </div>

        {isExpired && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            Your previous session expired. Please sign in again.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Form complying with modern web form guidelines */}
        <form onSubmit={handleSubmit} className="space-y-4" method="POST" action="/login">
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                spellCheck="false"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="input-with-left-icon !pl-11"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-xs font-bold text-slate-700">
                Password <span className="text-red-500">*</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input-with-both-icons !pl-11 !pr-11"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-pressed={showPassword}
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/30 transition disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : `Sign In as ${roleTab === 'hirer' ? 'Hirer' : 'Applicant'}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Helpers */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            One-Click Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillDemo('applicant')}
              className="py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-left transition"
            >
              👤 Demo Applicant
              <span className="block text-[10px] text-slate-400 font-normal">Candidate Account</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('hirer')}
              className="py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-left transition"
            >
              👑 Demo Hirer
              <span className="block text-[10px] text-slate-400 font-normal">Admin Manager</span>
            </button>
          </div>
        </div>

        {/* Registration CTA for applicants */}
        {roleTab === 'applicant' && (
          <p className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-700">
              Register as Catering Staff
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
