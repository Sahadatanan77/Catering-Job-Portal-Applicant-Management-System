# Catering Job Portal & Applicant Management System

A full-stack, production-ready recruitment and applicant management web application built for catering service owners, banquet managers, and part-time catering job seekers in Bangladesh.

---

## 🌟 Highlights & Key Features

### 👤 Applicant Experience
- **Account Registration & Secure Sign In**: Public registration with email and encrypted password (bcryptjs), persistent JWT authentication, and forgot-password recovery flow.
- **Single Reusable Profile**: Fill once with Full Name, verified Bangladeshi mobile number (`01XXXXXXXXX`), WhatsApp number, Hometown/Division, past catering experience, and skills. Reused across all shift applications without re-typing.
- **Document & Media Uploads**:
  - Profile photo for staff badge ID.
  - CV / Resume upload (`.pdf`, `.doc`, `.docx` up to 5MB) with secure server-side validation.
  - Work photo gallery showing banquet and catering event experience.
- **1-Click Shift Applications**: Explore available catering shifts across Dhanmondi, Gulshan, Banani, Uttara, etc., and apply with one click.
- **Live Status Tracking**: Real-time status tracking on the applicant dashboard (`Pending`, `Reviewed`, `Shortlisted`, `Hired / Accepted`, `Rejected`).

### 👑 Hirer & Admin Control Center
- **Protected Recruiter Access**: Dedicated Hirer login separated from public applicant signup, ensuring applicant privacy.
- **Recruitment Dashboard**: Metrics overview tracking Total Applicants, Pending Review, Shortlisted Candidates, Confirmed Hires, and Active Job Openings.
- **Candidate Pool Management**:
  - Searchable and filterable candidate table and card views.
  - Full candidate dossier with work background, photo gallery, and CV preview/download.
  - **Instant WhatsApp Communication**: Direct one-click WhatsApp chat link (`https://wa.me/8801...`) preloaded with customized candidate message.
- **Job Shift Manager**: Create, edit, pause, and track applicant counts for catering event shifts.
- **Applicant Status Lifecycle**: Update statuses between `Pending`, `Reviewed`, `Shortlisted`, `Hired`, and `Rejected` with internal hiring notes and applicant notification.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js (Vite), React Router v6 | Fast, accessible Single Page Application (SPA) |
| **Styling** | Tailwind CSS | Responsive, accessible, mobile-first design |
| **Icons** | Lucide React | Modern iconography |
| **Backend** | Node.js & Express.js | RESTful API service with role-based auth |
| **Database** | MongoDB Atlas / Mongoose | Scalable NoSQL schema with automatic local in-memory fallback |
| **Auth & Security** | JWT & bcryptjs | Token-based authentication, salted password hashing |
| **File Handling** | Multer & Cloudinary | File upload handling with automatic local disk fallback |
| **Validation** | Custom BD Phone & MIME validators | Validates 11-digit Bangladeshi operators (`013`-`019`) and safe file formats |

---

## 📁 Project Architecture

```
Catering Job Portal & Applicant Management System/
│
├── client/                         # React Frontend (Vite + Tailwind CSS)
│   ├── public/
│   │   ├── favicon.svg
│   │   └── ...
│   ├── src/
│   │   ├── components/             # Reusable UI Components
│   │   │   ├── Navbar.jsx          # Role-aware responsive navigation bar
│   │   │   ├── Footer.jsx          # CateringHub footer
│   │   │   ├── Sidebar.jsx         # Hirer dashboard navigation sidebar
│   │   │   ├── ProtectedRoute.jsx  # Role-based route guard
│   │   │   ├── ApplicantCard.jsx   # Grid card view for candidates
│   │   │   ├── ApplicantTable.jsx  # Responsive data table with actions
│   │   │   ├── FileUpload.jsx      # Drag-and-drop file upload with validation
│   │   │   └── StatusBadge.jsx     # Visual color-coded status badges
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx       # Sign-in with role tabs and demo accounts
│   │   │   │   ├── Register.jsx    # Public applicant sign-up form
│   │   │   │   └── ForgotPassword.jsx # Password reset token flow
│   │   │   ├── applicant/
│   │   │   │   ├── ApplicantDashboard.jsx # Profile score & live status updates
│   │   │   │   ├── ApplicantProfile.jsx   # Candidate view of personal dossier
│   │   │   │   ├── EditProfile.jsx        # Edit details & upload CV/photos
│   │   │   │   ├── AvailableJobs.jsx      # Search & filter active catering shifts
│   │   │   │   ├── ApplyForJob.jsx        # 1-Click application confirmation
│   │   │   │   └── MyApplications.jsx     # Status tracking feed
│   │   │   ├── hirer/
│   │   │   │   ├── HirerDashboard.jsx     # Statistics & recent applications
│   │   │   │   ├── AllApplicants.jsx      # Searchable candidate database
│   │   │   │   ├── ApplicantDetails.jsx   # Deep dive dossier & CV viewer
│   │   │   │   ├── ShortlistedApplicants.jsx # Shortlisted candidate view
│   │   │   │   ├── RejectedApplicants.jsx # Rejected candidate view
│   │   │   │   ├── ManageJobs.jsx         # Shift listings manager
│   │   │   │   └── CreateJob.jsx          # Post/edit catering shift
│   │   │   └── Home.jsx            # Landing page
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global authentication & applicant state
│   │   ├── services/
│   │   │   ├── api.js              # Axios instance with JWT interceptors
│   │   │   ├── authService.js      # Auth API calls
│   │   │   ├── applicantService.js # Profile & CV API calls
│   │   │   └── jobService.js       # Jobs & application API calls
│   │   ├── hooks/
│   │   │   └── useAuth.js          # Authentication consumer hook
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx       # Client route definitions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                         # Node.js + Express Backend
│   ├── config/
│   │   ├── db.js                   # Mongoose connection with MongoMemoryServer fallback
│   │   └── cloudinary.js           # Cloudinary / local storage fallback
│   ├── controllers/
│   │   ├── authController.js       # Register, login, forgot/reset password
│   │   ├── applicantController.js  # Profiles, file uploads, CV downloads
│   │   ├── jobController.js        # Catering job CRUD
│   │   └── applicationController.js# Shift applications & status updates
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT Bearer token validator
│   │   ├── roleMiddleware.js       # Role-based authorization ('hirer', 'applicant')
│   │   ├── uploadMiddleware.js     # Multer memory storage & filters
│   │   └── errorMiddleware.js      # 404 & global exception handler
│   ├── models/
│   │   ├── User.js                 # Login credential & role model
│   │   ├── Applicant.js            # Personal profile, CV, & photos
│   │   ├── Job.js                  # Catering shift details & requirements
│   │   └── Application.js          # Shift applications with status
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── applicantRoutes.js
│   │   ├── jobRoutes.js
│   │   └── applicationRoutes.js
│   ├── services/
│   │   ├── cloudinaryService.js    # Cloudinary stream / disk storage fallback
│   │   └── emailService.js         # SMTP / simulated email dispatcher
│   ├── utils/
│   │   ├── fileValidation.js       # BD phone regex & file MIME validations
│   │   ├── generateToken.js        # Signed JWT generator
│   │   └── seed.js                 # Automatic seed for admin & sample data
│   ├── uploads/                    # Local storage fallback directory
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── package.json                    # Root package with helper scripts
└── README.md
```

---

## 🗄️ Database Collections

### 1. `Users`
Stores authentication credentials and role:
```json
{
  "_id": "ObjectId",
  "email": "rahim@gmail.com",
  "password": "$2a$10$hashed_password",
  "role": "applicant", // or "hirer"
  "createdAt": "2026-11-22T10:00:00.000Z"
}
```

### 2. `Applicants`
Stores applicant dossier and uploaded media:
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "fullName": "Rahim Ahmed",
  "phone": "01711223344",
  "whatsapp": "01711223344",
  "hometown": "Dhaka",
  "experience": "2 years banquet serving experience in Dhanmondi and Uttara",
  "profilePicture": "https://... or /uploads/avatars/...",
  "cv": {
    "fileName": "rahim_cv.pdf",
    "fileUrl": "https://... or /uploads/cvs/...",
    "mimeType": "application/pdf",
    "size": 145000,
    "uploadedAt": "2026-11-22T10:00:00.000Z"
  },
  "additionalPictures": [
    { "url": "https://...", "caption": "Serving at wedding banquet" }
  ],
  "skills": ["Food Serving", "Table Setup", "Buffet Refills"]
}
```

### 3. `Jobs`
Stores catering shifts posted by the hirer:
```json
{
  "_id": "ObjectId",
  "title": "Part-Time Catering Staff & Food Servers",
  "description": "Serving food at luxury wedding reception...",
  "location": "Dhanmondi Club, Dhaka",
  "salary": "1,200 BDT / Day + Meal",
  "jobType": "Part-Time",
  "vacancies": 8,
  "eventDate": "Upcoming Friday (05:00 PM - 11:30 PM)",
  "shiftTimings": "Evening Shift (6.5 hours)",
  "status": "active",
  "postedBy": "ObjectId"
}
```

### 4. `Applications`
Connects applicant with a catering job shift:
```json
{
  "_id": "ObjectId",
  "applicantId": "ObjectId",
  "userId": "ObjectId",
  "jobId": "ObjectId",
  "status": "pending", // "pending" | "reviewed" | "shortlisted" | "rejected" | "hired"
  "coverNote": "Available this Friday evening. I have my own uniform.",
  "appliedAt": "2026-11-22T10:00:00.000Z"
}
```

---

## ⚡ Quick Start & Running Locally

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Running Backend Server
```bash
cd server
npm start
```
> The server automatically connects to MongoDB Atlas if `MONGODB_URI` is provided in `server/.env`. If not provided, it seamlessly spins up an in-memory MongoDB instance and auto-seeds the initial Admin and sample catering jobs!

- **API URL**: `http://localhost:5000/api`
- **Default Hirer Admin**: `admin@cateringportal.com`
- **Default Hirer Password**: `Admin@12345`

### 3. Running Frontend Client
```bash
cd client
npm run dev
```
- **Web App URL**: `http://localhost:5173`

---

## 🔑 Pre-Seeded Demo Accounts for Instant Testing

| Account Role | Email Address | Password | Profile / Purpose |
|---|---|---|---|
| **Hirer / Admin** | `admin@cateringportal.com` | `Admin@12345` | Catering Manager Dashboard, Candidate Review, Status Updates |
| **Applicant 1** | `rahim.ahmed@gmail.com` | `Password@123` | Rahim Ahmed (Dhaka, 2 yrs experience, Shortlisted) |
| **Applicant 2** | `tanvir.hasan@gmail.com` | `Password@123` | Tanvir Hasan (Chittagong, 1.5 yrs experience, Pending) |
| **Applicant 3** | `nusrat.jahan@gmail.com` | `Password@123` | Nusrat Jahan (Dhaka, 3 yrs VIP service, Hired) |

*You can also click the "One-Click Demo Accounts" buttons directly on the Login page!*

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` - Register applicant account
- `POST /api/auth/login` - Authenticate user & return JWT token
- `GET /api/auth/me` - Get current authenticated user profile
- `POST /api/auth/forgot-password` - Request password reset token
- `PUT /api/auth/reset-password/:resetToken` - Reset password with token
- `POST /api/auth/create-hirer` - Create new hirer account (Hirer only)

### Applicant Profile & CV
- `GET /api/applicants/profile` - Get applicant's own profile
- `POST /api/applicants/profile` - Save / update profile (with BD phone validation)
- `POST /api/applicants/upload` - Upload profile picture, CV, and event work photos
- `DELETE /api/applicants/photos/:photoId` - Delete an event work photo
- `GET /api/applicants` - Get all applicants with search/filter (Hirer only)
- `GET /api/applicants/:id` - Get applicant details and dossier (Hirer only)
- `GET /api/applicants/:id/cv/download` - Secure CV download endpoint (Hirer only)

### Catering Jobs
- `GET /api/jobs` - List active jobs (all jobs for hirer)
- `GET /api/jobs/:id` - Get single job details
- `POST /api/jobs` - Post new catering shift (Hirer only)
- `PUT /api/jobs/:id` - Update catering shift (Hirer only)
- `DELETE /api/jobs/:id` - Delete job posting (Hirer only)

### Shift Applications
- `POST /api/applications` - Apply for a catering shift (Applicant only, auto-sets status to `pending`)
- `GET /api/applications/my` - Get applicant's own submitted applications
- `GET /api/applications` - Get all applications with search/status filters (Hirer only)
- `GET /api/applications/stats/dashboard` - Hirer dashboard statistics (Hirer only)
- `PATCH /api/applications/:id/status` - Update application status (`pending`, `reviewed`, `shortlisted`, `rejected`, `hired`)

---

## 🔒 Security Best Practices Implemented
1. **Separation of Hirer & Applicant Access**: Public registration is strictly restricted to applicants; hirer accounts are protected and managed by the administrator.
2. **Password Encryption**: All passwords salted and hashed using `bcryptjs` with salt rounds = 10.
3. **MIME & Size Validation**: Strict server-side validation rejecting non-PDF/DOC files for CVs and non-images for avatars, capping files at 5MB.
4. **Bangladeshi Phone Validation**: Validates 11-digit Bangladeshi mobile formats (`013`-`019`) both on client and server before saving.
5. **Secure CV Endpoints**: CV download links require authentication and hirer authorization to prevent public scraping.
