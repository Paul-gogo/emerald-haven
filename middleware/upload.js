import multer from 'multer';

// Store uploaded files in memory as Buffer
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Max file size: 5MB per image
  },
});
