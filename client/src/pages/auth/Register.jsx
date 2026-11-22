import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Utensils, Eye, EyeOff, Lock, Mail, User, Phone, MapPin, ArrowRight } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    hometown: 'Dhaka',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');

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

  const validateBdPhone = (phone) => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    const regex = /^(?:\+?88)?01[3-9]\d{8}$/;
    return regex.test(cleaned);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'phone') {
      if (value && !validateBdPhone(value)) {
        setPhoneError('Enter a valid 11-digit BD number (e.g., 01712345678)');
      } else {
        setPhoneError('');
      }
    }

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateBdPhone(formData.phone)) {
      setPhoneError('Please enter a valid Bangladeshi mobile number (013-019XXXXXXXX)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        hometown: formData.hometown,
        password: formData.password,
      });

      if (res.success) {
        navigate('/applicant/edit-profile');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please check your information.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 mb-3">
            <Utensils className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Create Applicant Account
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Join our event catering workforce and discover part-time catering jobs
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" method="POST" action="/register">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="input-with-left-icon !pl-11"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Email */}
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

          {/* Bangladeshi Phone Number */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="phone" className="block text-xs font-bold text-slate-700">
                Phone Number (Bangladesh) <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-emerald-600 font-semibold">01XXXXXXXXX</span>
            </div>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="numeric"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className={`input-with-left-icon !pl-11 ${phoneError ? 'border-red-400 ring-red-400' : ''}`}
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {phoneError && (
              <p className="text-[11px] text-red-600 mt-1">{phoneError}</p>
            )}
          </div>

          {/* Hometown */}
          <div>
            <label htmlFor="hometown" className="block text-xs font-bold text-slate-700 mb-1">
              Hometown / City <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="hometown"
                name="hometown"
                value={formData.hometown}
                onChange={handleChange}
                className="input-with-left-icon !pl-11"
              >
                {bangladeshiDivisions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-slate-700 mb-1">
              Password (Min. 6 characters) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                minLength={6}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a secure password"
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
            {loading ? 'Creating Profile...' : 'Complete Registration'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
