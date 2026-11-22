/**
 * Validates a Bangladeshi mobile phone number.
 * Standard BD numbers have 11 digits:
 * Formats supported:
 * 013XXXXXXXX, 014XXXXXXXX, 015XXXXXXXX, 016XXXXXXXX, 017XXXXXXXX, 018XXXXXXXX, 019XXXXXXXX
 * With optional prefix +88 or 88
 */
const isValidBdPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Matches +8801[3-9]XXXXXXXX, 8801[3-9]XXXXXXXX, or 01[3-9]XXXXXXXX
  const bdRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
  return bdRegex.test(cleaned);
};

/**
 * Normalizes a Bangladeshi phone number to standard 11-digit format (e.g., 01712345678)
 */
const normalizeBdPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+88')) {
    return cleaned.slice(3);
  }
  if (cleaned.startsWith('88') && cleaned.length === 13) {
    return cleaned.slice(2);
  }
  return cleaned;
};

/**
 * Normalizes phone number to international format for WhatsApp link (e.g., 8801712345678)
 */
const getWhatsAppUrl = (phone, text = '') => {
  const norm = normalizeBdPhone(phone);
  if (!norm) return '';
  const intlNumber = `88${norm}`;
  const query = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${intlNumber}${query}`;
};

/**
 * Validates uploaded CV file type and size
 * Allowed: PDF, DOC, DOCX
 * Max Size: 5MB
 */
const validateCvFile = (file) => {
  if (!file) return { valid: false, message: 'No CV file provided.' };
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const ext = (file.originalname || '').toLowerCase().slice((file.originalname || '').lastIndexOf('.'));

  if (!allowedMimes.includes(file.mimetype) && !allowedExtensions.includes(ext)) {
    return {
      valid: false,
      message: 'Invalid CV file format. Only PDF, DOC, and DOCX files are allowed.',
    };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      message: 'CV file size exceeds maximum limit of 5MB.',
    };
  }

  return { valid: true };
};

/**
 * Validates uploaded image file type and size
 * Allowed: JPG, JPEG, PNG, WEBP
 * Max Size: 5MB
 */
const validateImageFile = (file) => {
  if (!file) return { valid: false, message: 'No image file provided.' };
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const ext = (file.originalname || '').toLowerCase().slice((file.originalname || '').lastIndexOf('.'));
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  if (!allowedMimes.includes(file.mimetype) && !allowedExtensions.includes(ext)) {
    return {
      valid: false,
      message: 'Invalid image format. Only JPG, PNG, and WEBP images are allowed.',
    };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      message: 'Image size exceeds maximum limit of 5MB.',
    };
  }

  return { valid: true };
};

module.exports = {
  isValidBdPhone,
  normalizeBdPhone,
  getWhatsAppUrl,
  validateCvFile,
  validateImageFile,
};
