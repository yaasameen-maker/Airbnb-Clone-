import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  getAllExperiences,
  updateExperienceStatus,
  deleteExperience,
  getPlatformStats,
  getAllBookings,
} from '../controllers/admin.controller';

const router = Router();

// All routes require ADMIN role
router.use(authenticate);
router.use(authorize('ADMIN'));

// User management
router.get('/users', getAllUsers); // Get all users with filters
router.get('/users/:id', getUserById); // Get user details
router.put('/users/:id/status', updateUserStatus); // Update user status (ban/unban)

// Experience management
router.get('/experiences', getAllExperiences); // Get all experiences with filters
router.put('/experiences/:id/status', updateExperienceStatus); // Approve/reject/suspend
router.delete('/experiences/:id', deleteExperience); // Delete experience (if no active bookings)

// Booking management
router.get('/bookings', getAllBookings); // Get all bookings

// Platform analytics
router.get('/stats', getPlatformStats); // Get platform statistics

export default router;
