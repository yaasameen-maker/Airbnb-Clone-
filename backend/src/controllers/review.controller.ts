import { Request, Response } from 'express';
import prisma from '../config/database';
import { validate, createReviewSchema, updateReviewSchema, getReviewsSchema } from '../utils/validation';
import { sendSuccess, sendError } from '../utils/response';

// Create a review (Only after booking is completed)
export const createReview = async (req: Request, res: Response) => {
  try {
    const validatedData = validate(createReviewSchema, req.body);
    const userId = req.user!.userId;

    // Check if booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: validatedData.bookingId },
      include: {
        schedule: {
          include: {
            experience: true,
          },
        },
      },
    });

    if (!booking) {
      return sendError(res, 'Booking not found', 404);
    }

    if (booking.guestId !== userId) {
      return sendError(res, 'You can only review your own bookings', 403);
    }

    // Check if booking is completed
    if (booking.status !== 'COMPLETED') {
      return sendError(res, 'You can only review completed experiences', 400);
    }

    // Check if booking date has passed
    if (new Date(booking.schedule.startDateTime) > new Date()) {
      return sendError(res, 'You can only review past experiences', 400);
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { bookingId: validatedData.bookingId },
    });

    if (existingReview) {
      return sendError(res, 'Review already exists for this booking', 400);
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        bookingId: validatedData.bookingId,
        experienceId: booking.schedule.experienceId,
        reviewerId: userId,
        overallRating: validatedData.rating,
        qualityRating: validatedData.rating,
        communicationRating: validatedData.rating,
        accuracyRating: validatedData.rating,
        locationRating: validatedData.rating,
        valueRating: validatedData.rating,
        comment: validatedData.comment,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photo: true,
          },
        },
        experience: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Update experience average rating
    const experienceReviews = await prisma.review.findMany({
      where: { experienceId: booking.schedule.experienceId },
      select: { overallRating: true },
    });

    const avgRating = experienceReviews.reduce((sum, r) => sum + r.overallRating, 0) / experienceReviews.length;

    await prisma.experience.update({
      where: { id: booking.schedule.experienceId },
      data: {
        averageRating: avgRating,
        totalReviews: experienceReviews.length,
      },
    });

    return sendSuccess(res, review, 'Review created successfully', 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create review', 400);
  }
};

// Get reviews for an experience
export const getExperienceReviews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      sortBy: (req.query.sortBy as string) || 'recent',
    };

    const validatedQuery = validate(getReviewsSchema, query);

    // Check if experience exists
    const experience = await prisma.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      return sendError(res, 'Experience not found', 404);
    }

    const skip = ((validatedQuery.page ?? 1) - 1) * (validatedQuery.limit ?? 10);

    // Determine sort order
    let orderBy: any = { createdAt: 'desc' };
    if (validatedQuery.sortBy === 'rating') {
      orderBy = { overallRating: 'desc' };
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { experienceId: id },
        skip,
        take: validatedQuery.limit,
        orderBy,
        include: {
          reviewer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              photo: true,
              createdAt: true,
            },
          },
        },
      }),
      prisma.review.count({
        where: { experienceId: id },
      }),
    ]);

    return sendSuccess(res, {
      reviews,
      pagination: {
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        total,
        totalPages: Math.ceil(total / (validatedQuery.limit ?? 10)),
      },
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch reviews', 400);
  }
};

// Get a single review by ID
export const getReviewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photo: true,
            createdAt: true,
          },
        },
        experience: {
          select: {
            id: true,
            title: true,
            hostId: true,
          },
        },
      },
    });

    if (!review) {
      return sendError(res, 'Review not found', 404);
    }

    return sendSuccess(res, review);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch review', 500);
  }
};

// Update review (Only by reviewer within 7 days)
export const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = validate(updateReviewSchema, req.body);
    const userId = req.user!.userId;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        experience: true,
      },
    });

    if (!review) {
      return sendError(res, 'Review not found', 404);
    }

    if (review.reviewerId !== userId) {
      return sendError(res, 'You can only update your own reviews', 403);
    }

    // Check if review is within 7 days
    const daysSinceReview = Math.floor(
      (new Date().getTime() - new Date(review.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceReview > 7) {
      return sendError(res, 'Reviews can only be edited within 7 days', 400);
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        ...(validatedData.rating && {
          overallRating: validatedData.rating,
          qualityRating: validatedData.rating,
          communicationRating: validatedData.rating,
          accuracyRating: validatedData.rating,
          locationRating: validatedData.rating,
          valueRating: validatedData.rating,
        }),
        ...(validatedData.comment && { comment: validatedData.comment }),
      },
      include: {
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photo: true,
          },
        },
      },
    });

    // Recalculate experience average rating
    const experienceReviews = await prisma.review.findMany({
      where: { experienceId: review.experienceId },
      select: { overallRating: true },
    });

    const avgRating = experienceReviews.reduce((sum, r) => sum + r.overallRating, 0) / experienceReviews.length;

    await prisma.experience.update({
      where: { id: review.experienceId },
      data: { averageRating: avgRating },
    });

    return sendSuccess(res, updatedReview, 'Review updated successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update review', 400);
  }
};

// Delete review (Only by reviewer or admin)
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return sendError(res, 'Review not found', 404);
    }

    if (review.reviewerId !== userId && userRole !== 'ADMIN') {
      return sendError(res, 'You can only delete your own reviews', 403);
    }

    await prisma.review.delete({
      where: { id },
    });

    // Update experience stats
    const experienceReviews = await prisma.review.findMany({
      where: { experienceId: review.experienceId },
      select: { overallRating: true },
    });

    const avgRating = experienceReviews.length > 0
      ? experienceReviews.reduce((sum, r) => sum + r.overallRating, 0) / experienceReviews.length
      : 0;

    await prisma.experience.update({
      where: { id: review.experienceId },
      data: {
        averageRating: avgRating,
        totalReviews: experienceReviews.length,
      },
    });

    return sendSuccess(res, null, 'Review deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete review', 500);
  }
};

// Get my reviews (as a reviewer)
export const getMyReviews = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { reviewerId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          experience: {
            select: {
              id: true,
              title: true,
              
            },
          },
        },
      }),
      prisma.review.count({
        where: { reviewerId: userId },
      }),
    ]);

    return sendSuccess(res, {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch reviews', 500);
  }
};

// Get reviews about me (as a host)
export const getReviewsAboutMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          experience: {
            hostId: userId,
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reviewer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              photo: true,
            },
          },
          experience: {
            select: {
              id: true,
              title: true,
              
            },
          },
        },
      }),
      prisma.review.count({
        where: {
          experience: {
            hostId: userId,
          },
        },
      }),
    ]);

    return sendSuccess(res, {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch reviews', 500);
  }
};

// Host responds to a review
export const respondToReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    const userId = req.user!.userId;

    if (!response || response.trim().length < 10) {
      return sendError(res, 'Response must be at least 10 characters', 400);
    }

    if (response.length > 500) {
      return sendError(res, 'Response cannot exceed 500 characters', 400);
    }

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        experience: true,
      },
    });

    if (!review) {
      return sendError(res, 'Review not found', 404);
    }

    if (review.experience.hostId !== userId) {
      return sendError(res, 'Only the host can respond to reviews', 403);
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        hostResponse: response,
        hostRespondedAt: new Date(),
      },
      include: {
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photo: true,
          },
        },
      },
    });

    return sendSuccess(res, updatedReview, 'Response posted successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to post response', 500);
  }
};


