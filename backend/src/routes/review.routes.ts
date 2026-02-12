import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createReview,
  getExperienceReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getMyReviews,
  getReviewsAboutMe,
  respondToReview,
} from '../controllers/review.controller';

const router = Router();

// Public routes
router.get('/experiences/:id/reviews', getExperienceReviews); // Get all reviews for an experience

// Protected routes (require authentication)
router.post('/', authenticate, createReview); // Create a review
router.get('/me', authenticate, getMyReviews); // Get my reviews
router.get('/about-me', authenticate, getReviewsAboutMe); // Get reviews about my experiences (HOST)
router.get('/:id', authenticate, getReviewById); // Get single review
router.put('/:id', authenticate, updateReview); // Update review
router.delete('/:id', authenticate, deleteReview); // Delete review
router.post('/:id/respond', authenticate, respondToReview); // Host responds to review

export default router;
