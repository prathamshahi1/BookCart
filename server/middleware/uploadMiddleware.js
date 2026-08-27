import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Use /tmp in serverless or ./uploads locally
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT;
const uploadDir = isServerless ? path.join(os.tmpdir(), 'uploads') : 'uploads/';

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  // Silent fail in strictly read-only environments
}

// Storage configuration: memory storage for serverless, disk for local development
const storage = isServerless
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination(req, file, cb) {
        cb(null, uploadDir);
      },
      filename(req, file, cb) {
        cb(
          null,
          `${file.fieldname}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`
        );
      }
    });

// File filter validation
const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp|svg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only (jpg, jpeg, png, webp, svg)!'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});
