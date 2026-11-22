const fs = require('fs');
const path = require('path');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

// Ensure local uploads directory exists for fallback
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Uploads a buffer or file path to Cloudinary or falls back to local storage
 * @param {Object} file - Multer file object
 * @param {String} folder - Target folder/subfolder ('avatars', 'cvs', 'events')
 */
const uploadFile = async (file, folder = 'general') => {
  if (!file) return null;

  // 1. If Cloudinary is configured, upload to Cloudinary
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const isPdfOrDoc = file.mimetype.includes('pdf') || file.mimetype.includes('msword') || file.mimetype.includes('officedocument');
      const uploadOptions = {
        folder: `catering_portal/${folder}`,
        resource_type: isPdfOrDoc ? 'raw' : 'auto',
        use_filename: true,
        unique_filename: true,
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error, using local fallback:', error.message);
            // Fallback to local
            const localResult = saveLocalFile(file, folder);
            return resolve(localResult);
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            fileName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
          });
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  // 2. Local disk fallback
  return saveLocalFile(file, folder);
};

/**
 * Saves a file locally in /server/uploads
 */
const saveLocalFile = (file, folder = 'general') => {
  const folderPath = path.join(uploadDir, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const timestamp = Date.now();
  const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueFileName = `${timestamp}_${safeName}`;
  const filePath = path.join(folderPath, uniqueFileName);

  fs.writeFileSync(filePath, file.buffer);

  // Return a relative URL that can be fetched via Express static route or download endpoint
  const fileUrl = `/uploads/${folder}/${uniqueFileName}`;

  return {
    url: fileUrl,
    publicId: uniqueFileName,
    fileName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  };
};

/**
 * Delete a file from Cloudinary or local storage
 */
const deleteFile = async (publicId, isRaw = false) => {
  if (!publicId) return;

  if (isCloudinaryConfigured) {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: isRaw ? 'raw' : 'image',
      });
    } catch (err) {
      console.warn('Failed to delete file from Cloudinary:', err.message);
    }
  } else {
    // Check local folders
    const subfolders = ['avatars', 'cvs', 'events', 'general'];
    for (const folder of subfolders) {
      const p = path.join(uploadDir, folder, publicId);
      if (fs.existsSync(p)) {
        try {
          fs.unlinkSync(p);
        } catch (e) {
          console.warn('Failed to remove local file:', e.message);
        }
        break;
      }
    }
  }
};

module.exports = {
  uploadFile,
  deleteFile,
};
