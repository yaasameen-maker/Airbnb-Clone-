import { Request, Response } from 'express';
import prisma from '../config/database';
import { validate, updateExperienceStatusSchema } from '../utils/validation';
import { sendSuccess, sendError } from '../utils/response';

// Get all users (Admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const isActive = req.query.isActive as string;
    const role = req.query.role as string;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }
    
    if (role) {
      where.role = role;
    }
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          photo: true,
          phoneVerified: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: {
              experiences: true,
              bookings: true,
              reviews: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return sendSuccess(res, {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }, 'Users retrieved successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch users', 500);
  }
};

// Get user details by ID (Admin only)
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        photo: true,
        phoneVerified: true,
        emailVerified: true,
        createdAt: true,
        bio: true,
        languages: true,
        hometown: true,
        _count: {
          select: {
            experiences: true,
            bookings: true,
            reviews: true,
            wishlists: true,
          },
        },
        experiences: {
          select: {
            id: true,
            title: true,
            status: true,
            averageRating: true,
            totalBookings: true,
          },
          take: 10,
        },
        bookings: {
          select: {
            id: true,
            status: true,
            total: true,
            createdAt: true,
          },
          take: 10,
        },
      },
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, user, 'User details retrieved successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch user', 500);
  }
};

// Update user status (Admin only)
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Prevent admin from changing their own status
    if (user.id === req.user!.userId) {
      return sendError(res, 'You cannot change your own status', 400);
    }

    // Map status to isActive
    const isActive = status === 'ACTIVE';

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isActive,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    return sendSuccess(res, updatedUser, 'User status updated successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update user status', 400);
  }
};

// Get all experiences (Admin only)
export const getAllExperiences = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const status = req.query.status as string;
    const category = req.query.category as string;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (category) {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [experiences, total] = await Promise.all([
      prisma.experience.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          host: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
      }),
      prisma.experience.count({ where }),
    ]);

    return sendSuccess(res, {
      experiences,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }, 'Experiences retrieved successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch experiences', 500);
  }
};

// Update experience status (Admin only)
export const updateExperienceStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = validate(updateExperienceStatusSchema, req.body);

    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            email: true,
            firstName: true,
          },
        },
      },
    });

    if (!experience) {
      return sendError(res, 'Experience not found', 404);
    }

    const updatedExperience = await prisma.experience.update({
      where: { id },
      data: {
        status: validatedData.status,
        ...(validatedData.rejectionReason && { rejectionReason: validatedData.rejectionReason }),
      },
      include: {
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return sendSuccess(res, updatedExperience, 'Experience status updated successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update experience status', 400);
  }
};

// Get platform statistics (Admin only)
export const getPlatformStats = async (req: Request, res: Response) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(0);
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

    const [
      totalUsers,
      activeUsers,
      totalHosts,
      totalExperiences,
      activeExperiences,
      totalBookings,
      completedBookings,
      totalRevenue,
      totalReviews,
      averageRating,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          isActive: true,
          lastLoginAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
      prisma.user.count({
        where: { role: 'HOST' },
      }),
      prisma.experience.count(),
      prisma.experience.count({
        where: { status: 'ACTIVE' },
      }),
      prisma.booking.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      prisma.booking.count({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      prisma.booking.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: {
          total: true,
        },
      }),
      prisma.review.count(),
      prisma.review.aggregate({
        _avg: {
          overallRating: true,
        },
      }),
    ]);

    // Get top categories
    const topCategories = await prisma.experience.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
      orderBy: {
        _count: {
          category: 'desc',
        },
      },
      take: 5,
    });

    // Get recent bookings
    const recentBookings = await prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        guest: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        schedule: {
          include: {
            experience: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    return sendSuccess(res, {
      overview: {
        totalUsers,
        activeUsers,
        totalHosts,
        totalExperiences,
        activeExperiences,
        totalBookings,
        completedBookings,
        totalRevenue: totalRevenue._sum?.total || 0,
        totalReviews,
        averageRating: averageRating._avg.overallRating || 0,
      },
      topCategories,
      recentBookings,
    }, 'Platform statistics retrieved successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch statistics', 500);
  }
};

// Get all bookings (Admin only)
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const status = req.query.status as string;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (status) {
      where.status = status;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          guest: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          schedule: {
            include: {
              experience: {
                select: {
                  id: true,
                  title: true,
                  hostId: true,
                  host: {
                    select: {
                      firstName: true,
                      lastName: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    return sendSuccess(res, {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }, 'Bookings retrieved successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch bookings', 500);
  }
};

// Delete experience (Admin only)
export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const experience = await prisma.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      return sendError(res, 'Experience not found', 404);
    }

    // Check for active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        schedule: {
          experienceId: id,
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
    });

    if (activeBookings > 0) {
      return sendError(res, 'Cannot delete experience with active bookings. Suspend it instead.', 400);
    }

    await prisma.experience.delete({
      where: { id },
    });

    return sendSuccess(res, null, 'Experience deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete experience', 500);
  }
};
