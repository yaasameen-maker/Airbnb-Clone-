import { Router } from 'express';
import {
  createExperience,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
  uploadExperiencePhotos,
  deleteExperiencePhoto,
  createSchedule,
  getMyExperiences,
} from '../controllers/experience.controller';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', getExperiences);
router.get('/:id', getExperienceById);

// Protected routes - require authentication
router.use(authenticate);

// Get my experiences
router.get('/me/list', getMyExperiences);

// Host-only routes
router.post('/', authorize('HOST', 'ADMIN'), createExperience);
router.put('/:id', authorize('HOST', 'ADMIN'), updateExperience);
router.delete('/:id', authorize('HOST', 'ADMIN'), deleteExperience);

// Photo management
router.post(
  '/:id/photos',
  authorize('HOST', 'ADMIN'),
  upload.array('photos', 10),
  uploadExperiencePhotos
);
router.delete('/:id/photos/:photoId', authorize('HOST', 'ADMIN'), deleteExperiencePhoto);

// Schedule management
router.post('/:id/schedules', authorize('HOST', 'ADMIN'), createSchedule);

export default router;
