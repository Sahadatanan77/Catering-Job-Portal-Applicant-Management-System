import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { applicantService } from '../../services/applicantService';
import FileUpload from '../../components/FileUpload';
import {
  User,
  Phone,
  MessageSquare,
  MapPin,
  Briefcase,
  FileText,
  Camera,
  Save,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

const EditProfile = () => {
  const { user, applicant, updateApplicantState } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    hometown: 'Dhaka',
    experience: '',
    bio: '',
    skills: 'Food Serving, Table Setup, Buffet Management',
  });

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [eventPhotos, setEventPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
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

  useEffect(() => {
    if (applicant) {
      setFormData({
        fullName: applicant.fullName || '',
        phone: applicant.phone || '',
        whatsapp: applicant.whatsapp || '',
        hometown: applicant.hometown || 'Dhaka',
        experience: applicant.experience || '',
        bio: applicant.bio || '',
        skills: Array.isArray(applicant.skills)
          ? applicant.skills.join(', ')
          : 'Food Serving, Table Setup',
      });
    }
  }, [applicant]);

  const validateBdPhone = (phone) => {
    const cleaned = (phone || '').replace(/[\s\-\(\)]/g, '');
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
        setPhoneError('Please enter a valid 11-digit Bangladeshi mobile number.');
      } else {
        setPhoneError('');
      }
    }

    if (errorMsg) setErrorMsg('');
    if (successMsg) setSuccessMsg('');
  };

  const handleEventPhotoAdd = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + eventPhotos.length > 5) {
      setErrorMsg('You can upload up to 5 additional event photos.');
      return;
    }
    setEventPhotos((prev) => [...prev, ...files]);
  };

  const removeSelectedEventPhoto = (index) => {
    setEventPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateBdPhone(formData.phone)) {
      setPhoneError('A valid Bangladeshi phone number (e.g. 01XXXXXXXXX) is required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 1. Save profile text fields
      const profileRes = await applicantService.saveProfile(formData);
      let updatedApplicant = profileRes.applicant;

      // 2. Upload files if provided
      if (profilePicFile || cvFile || eventPhotos.length > 0) {
        const uploadData = new FormData();
        if (profilePicFile) {
          uploadData.append('profilePicture', profilePicFile);
        }
        if (cvFile) {
          uploadData.append('cv', cvFile);
        }
        if (eventPhotos.length > 0) {
          eventPhotos.forEach((file) => {
            uploadData.append('additionalPictures', file);
          });
        }

        const uploadRes = await applicantService.uploadFiles(uploadData);
        if (uploadRes.success) {
          updatedApplicant = uploadRes.applicant;
        }
      }

      updateApplicantState(updatedApplicant);
      setSuccessMsg('Profile and files saved successfully!');
      setTimeout(() => {
        navigate('/applicant/profile');
      }, 1500);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Error updating profile. Please verify your inputs.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
        <div className="border-b border-slate-100 pb-5 mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Edit Applicant Profile & CV
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Provide your verified contact details and catering background so hirers can reach you
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Personal Details */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. Personal & Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="input-with-left-icon !pl-11"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

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

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="phone" className="block text-xs font-bold text-slate-700">
                    Phone Number (BD) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-emerald-600 font-semibold">01XXXXXXXXX</span>
                </div>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    className={`input-with-left-icon !pl-11 ${phoneError ? 'border-red-400' : ''}`}
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {phoneError && <p className="text-[11px] text-red-600 mt-1">{phoneError}</p>}
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    className="input-with-left-icon !pl-11"
                  />
                  <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Experience & Bio */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              2. Work Experience & Catering Skills
            </h2>

            <div>
              <label htmlFor="experience" className="block text-xs font-bold text-slate-700 mb-1">
                Catering & Banquet Experience
              </label>
              <textarea
                id="experience"
                name="experience"
                rows={3}
                value={formData.experience}
                onChange={handleChange}
                placeholder="E.g., 2 years experience serving at wedding banquets, corporate dinners, buffet refills..."
              ></textarea>
            </div>

            <div>
              <label htmlFor="skills" className="block text-xs font-bold text-slate-700 mb-1">
                Hospitality Skills (Comma separated)
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Food Serving, Table Setup, VIP Guest Service, Buffet Coordination"
              />
            </div>
          </div>

          {/* Section: Document Uploads */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              3. Document & Media Uploads
            </h2>

            {/* Profile Picture */}
            <div>
              <FileUpload
                id="profilePicture"
                label="Profile Picture (Portrait photo for ID)"
                accept=".jpg,.jpeg,.png,.webp"
                maxSizeMB={5}
                helperText="JPG, PNG, or WEBP portrait (max 5MB)"
                onFileSelect={(file) => setProfilePicFile(file)}
                existingFileName={applicant?.profilePicture ? 'Existing Profile Picture' : ''}
              />
            </div>

            {/* CV Upload */}
            <div>
              <FileUpload
                id="cv"
                label="Curriculum Vitae / Resume (CV)"
                accept=".pdf,.doc,.docx"
                maxSizeMB={5}
                helperText="PDF, DOC, or DOCX document (max 5MB)"
                onFileSelect={(file) => setCvFile(file)}
                existingFileName={applicant?.cv?.fileName || ''}
              />
            </div>

            {/* Additional Event Work Photos */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Additional Catering Event Photos (Optional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleEventPhotoAdd}
                className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
              />

              {eventPhotos.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {eventPhotos.map((file, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] text-slate-700 font-medium"
                    >
                      {file.name}
                      <button
                        type="button"
                        onClick={() => removeSelectedEventPhoto(i)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/applicant/profile')}
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
              {loading ? 'Saving Profile & Files...' : 'Save Profile Information'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
