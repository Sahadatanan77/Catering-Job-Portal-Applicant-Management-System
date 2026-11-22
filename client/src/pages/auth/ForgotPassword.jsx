import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Mail, Lock, ArrowRight, CheckCircle2, AlertCircle, Utensils } from 'lucide-react';

const ForgotPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [devToken, setDevToken] = useState('');

  const isResetMode = Boolean(resetToken);

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await authService.forgotPassword(email);
      if (res.success) {
        setMessage(res.message);
        if (res.resetTokenDev) {
          setDevToken(res.resetTokenDev);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await authService.resetPassword(resetToken, newPassword);
      if (res.success) {
        setMessage('Your password has been reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset link is invalid or has expired.');
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
            {isResetMode ? 'Set New Password' : 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isResetMode
              ? 'Enter your new secure password below'
              : 'Enter your account email to receive a password recovery link'}
          </p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {devToken && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
            <p className="font-bold">Development Mode Helper:</p>
            <p className="break-all mt-1">Direct Reset Token: {devToken}</p>
            <Link
              to={`/reset-password/${devToken}`}
              className="mt-2 inline-block font-semibold text-blue-700 underline"
            >
              Click here to test Reset Password page
            </Link>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isResetMode ? (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-xs font-bold text-slate-700 mb-1">
                New Password (Min. 6 characters) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-with-left-icon !pl-11"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/30 transition disabled:opacity-50"
            >
              {loading ? 'Updating Password...' : 'Save New Password'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1">
                Registered Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-with-left-icon !pl-11"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/30 transition disabled:opacity-50"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-xs font-bold text-slate-500 hover:text-slate-800">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
