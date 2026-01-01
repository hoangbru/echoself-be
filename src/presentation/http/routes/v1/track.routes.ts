import { Router } from 'express';
import multer from 'multer';

import { TrackController } from '../../controllers/TrackController';
import { authMiddleware, validateRequest } from '../../middlewares';
import { uploadTrackSchema } from '../../validators/trackValidator';


const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/flac',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

export function createTrackRoutes(trackController: TrackController): Router {
  const router = Router();

  router.post(
    '/',
    authMiddleware,
    upload.single('audio'),
    validateRequest(uploadTrackSchema),
    (req, res, next) => trackController.upload(req, res, next),
  );

  return router;
}
