import { Platform } from 'react-native';

// In Expo/React Native on Windows:
// - Physical device via Expo Go: use your computer's local Wi-Fi IP (192.168.0.3)
// - Android Emulator: 10.0.2.2 points to host localhost
// - Web / iOS Simulator: localhost
export const LAN_IP = '192.168.0.3';

export const API_BASE_URL = Platform.select({
  android: `http://${LAN_IP}:5000/api`,
  ios: `http://${LAN_IP}:5000/api`,
  web: 'http://localhost:5000/api',
  default: `http://${LAN_IP}:5000/api`,
});

export const COLORS = {
  primary: '#059669', // Emerald 600
  primaryDark: '#047857',
  primaryLight: '#D1FAE5',
  accent: '#10B981',
  background: '#F8FAFC',
  card: '#FFFFFF',
  text: '#0F172A', // Slate 900
  textMuted: '#64748B', // Slate 500
  border: '#E2E8F0',
  error: '#EF4444',
  errorBg: '#FEF2F2',
  success: '#10B981',
  warning: '#F59E0B',
};

export const STATUS_COLORS = {
  pending: { bg: '#FEF3C7', text: '#B45309', label: 'Pending Review' },
  reviewed: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Reviewed' },
  shortlisted: { bg: '#E0E7FF', text: '#4338CA', label: 'Shortlisted' },
  hired: { bg: '#D1FAE5', text: '#065F46', label: 'Hired / Accepted' },
  rejected: { bg: '#FEE2E2', text: '#B91C1C', label: 'Rejected' },
};

export const BANGLADESH_DIVISIONS = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'Mymensingh',
];
