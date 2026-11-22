import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import Home from '../pages/Home';
import AvailableJobs from '../pages/applicant/AvailableJobs';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Applicant pages
import ApplicantDashboard from '../pages/applicant/ApplicantDashboard';
import ApplicantProfile from '../pages/applicant/ApplicantProfile';
import EditProfile from '../pages/applicant/EditProfile';
import ApplyForJob from '../pages/applicant/ApplyForJob';
import MyApplications from '../pages/applicant/MyApplications';

// Hirer pages
import HirerDashboard from '../pages/hirer/HirerDashboard';
import AllApplicants from '../pages/hirer/AllApplicants';
import ApplicantDetails from '../pages/hirer/ApplicantDetails';
import ShortlistedApplicants from '../pages/hirer/ShortlistedApplicants';
import RejectedApplicants from '../pages/hirer/RejectedApplicants';
import ManageJobs from '../pages/hirer/ManageJobs';
import CreateJob from '../pages/hirer/CreateJob';

// Route guard
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<AvailableJobs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:resetToken" element={<ForgotPassword />} />

      {/* Protected Applicant Routes */}
      <Route
        path="/applicant/dashboard"
        element={
          <ProtectedRoute requiredRole="applicant">
            <ApplicantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicant/profile"
        element={
          <ProtectedRoute requiredRole="applicant">
            <ApplicantProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicant/edit-profile"
        element={
          <ProtectedRoute requiredRole="applicant">
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicant/apply/:jobId"
        element={
          <ProtectedRoute requiredRole="applicant">
            <ApplyForJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applicant/my-applications"
        element={
          <ProtectedRoute requiredRole="applicant">
            <MyApplications />
          </ProtectedRoute>
        }
      />

      {/* Protected Hirer / Admin Routes */}
      <Route
        path="/hirer/dashboard"
        element={
          <ProtectedRoute requiredRole="hirer">
            <HirerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hirer/applicants"
        element={
          <ProtectedRoute requiredRole="hirer">
            <AllApplicants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hirer/applicants/:id"
        element={
          <ProtectedRoute requiredRole="hirer">
            <ApplicantDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hirer/shortlisted"
        element={
          <ProtectedRoute requiredRole="hirer">
            <ShortlistedApplicants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hirer/rejected"
        element={
          <ProtectedRoute requiredRole="hirer">
            <RejectedApplicants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hirer/manage-jobs"
        element={
          <ProtectedRoute requiredRole="hirer">
            <ManageJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hirer/create-job"
        element={
          <ProtectedRoute requiredRole="hirer">
            <CreateJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hirer/edit-job/:id"
        element={
          <ProtectedRoute requiredRole="hirer">
            <CreateJob />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
