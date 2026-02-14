import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
import config from './config';
import logger from './config/logger';
import prisma from './config/database';
import redis from './config/redis';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';

// Create Express app
const app: Express = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.frontend.url,
    credentials: true,
  },
});

// Middleware
app.use(helmet());

// Configure CORS to allow both local and production frontends
const allowedOrigins = [
  config.frontend.url,
  'http://localhost:5173',
  'http://localhost:3000',
  /\.vercel\.app$/,  // Allow all Vercel app subdomains
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list or matches pattern
      const isAllowed = allowedOrigins.some(allowed => {
        if (allowed instanceof RegExp) return allowed.test(origin);
        return allowed === origin;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all origins for now during development
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Apply rate limiting
app.use('/api', apiLimiter);

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', async (_req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis connection (if enabled)
    let redisStatus = 'disabled';
    if (redis) {
      try {
        await redis.ping();
        redisStatus = 'connected';
      } catch {
        redisStatus = 'disconnected';
      }
    }

    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.env,
      services: {
        database: 'connected',
        redis: redisStatus,
      },
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Service unavailable',
    });
  }
});

// API routes
app.use(`/api/${config.apiVersion}`, routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler
app.use(errorHandler);

// Socket.IO connection handler (placeholder - will be expanded in Week 7)
io.on('connection', socket => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Graceful shutdown
const gracefulShutdown = async () => {
  logger.info('🛑 Shutting down gracefully...');

  // Close HTTP server
  httpServer.close(() => {
    logger.info('HTTP server closed');
  });

  // Close database connection
  await prisma.$disconnect();
  logger.info('Database connection closed');

  // Close Redis connection
  if (redis) {
    redis.disconnect();
    logger.info('Redis connection closed');
  }

  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const PORT = config.port;

httpServer.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${config.env} mode`);
  logger.info(`📖 API available at http://localhost:${PORT}/api/${config.apiVersion}`);
});

export { app, io };
