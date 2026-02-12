import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getHostBookings,
  confirmBooking,
} from '../controllers/booking.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All booking routes require authentication
router.use(authenticate);

// Guest booking routes
router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/:id', getBookingById);
router.post('/:id/cancel', cancelBooking);

// Host booking routes
router.get('/host/bookings', authorize('HOST', 'ADMIN'), getHostBookings);
router.post('/:id/confirm', authorize('HOST', 'ADMIN'), confirmBooking);

export default router;
