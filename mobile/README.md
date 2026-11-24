# CateringHub Mobile App (React Native / Expo)

Cross-platform native mobile application for the **Catering Job Portal & Applicant Management System**, connecting event catering workers with catering managers in Bangladesh.

---

## 📱 Features

### For Catering Applicants:
- **Fast Sign In & Registration**: Built-in phone validation for Bangladeshi numbers (`01XXXXXXXXX`).
- **Explore Catering Shifts**: Browse part-time catering events, banquet servers, buffet coordinators across Dhaka and other divisions.
- **1-Click Apply**: Immediate shift applications reusing candidate credentials without re-entering info.
- **Status Feed**: Live tracking of application status (`Pending`, `Reviewed`, `Shortlisted`, `Hired / Accepted`, `Rejected`).
- **Candidate Profile**: Displays catering skills, past experience, and contact numbers.

### For Hirers & Recruiters:
- **Recruitment Dashboard**: Metrics overview (Total candidates, pending reviews, shortlisted, confirmed hires).
- **Candidate Pool**: Searchable candidate roster with verified badges.
- **Instant Outreach**: One-tap native **Call** (`tel:`) and direct **WhatsApp** (`https://wa.me/...`) buttons to start interviews immediately.
- **Status Lifecycle**: Move candidates between shortlisted, hired, and rejected with one tap.

---

## 🚀 How to Run the Mobile App

### 1. Ensure the Backend Server is Running
The mobile app communicates with your backend API. Make sure your backend is active:
```bash
cd server
npm start
```
*(Backend runs on `http://localhost:5000/api` or `http://192.168.0.3:5000/api`)*

### 2. Start the Expo Dev Server
In the root directory or inside `mobile/`:
```bash
cd mobile
npm start
```

### 3. Test on your Device:
- **On a Physical Android / iPhone**:
  1. Install **Expo Go** from the Google Play Store or iOS App Store.
  2. Ensure your phone is connected to the same Wi-Fi network as your computer (`192.168.0.3`).
  3. Open Expo Go and scan the QR code displayed in your terminal.
- **On Android Emulator**:
  - Press `a` in the terminal to launch on your active Android emulator.
- **On Web Browser**:
  - Press `w` in the terminal to preview in your desktop browser.

---

## ⚙️ Configuration
The backend server IP is configured in:
`src/config/constants.js`

If your computer's Wi-Fi IP address changes, update `LAN_IP` in `src/config/constants.js`.
