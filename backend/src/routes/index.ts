import { Router } from 'express';
import authRoutes from './auth.routes';
import experienceRoutes from './experience.routes';
import bookingRoutes from './booking.routes';
import reviewRoutes from './review.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/experiences', experienceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/admin', adminRoutes);

// Health check for API
router.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
