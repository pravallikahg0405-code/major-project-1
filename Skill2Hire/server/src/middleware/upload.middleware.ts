import multer from 'multer';

// In-memory storage to prevent leaving temporary unmanaged files on disk
const storage = multer.memoryStorage();

export const uploadResume = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max file size
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (
      allowedMimeTypes.includes(file.mimetype) ||
      file.originalname.match(/\.(pdf|docx|doc)$/i)
    ) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Please upload a PDF or DOCX resume.'));
    }
  }
});
