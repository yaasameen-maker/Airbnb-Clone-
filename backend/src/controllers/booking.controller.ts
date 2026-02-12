import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { validate, createBookingSchema } from '../utils/validation';
import { successResponse, errorResponse } from '../utils/response';
import { v4 as uuidv4 } from 'uuid';

// Create a new booking
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = validate(createBookingSchema, req.body);
    const userId = req.user!.userId;

    const schedule = await prisma.schedule.findUnique({
      where: { id: validatedData.scheduleId },
      include: {
        experience: true,
      },
    });

    if (!schedule) {
      return errorResponse(res, 'Schedule not found', 404);
    }

    if (schedule.status !== 'AVAILABLE') {
      return errorResponse(res, 'This schedule is not available for booking', 400);
    }

    if (schedule.spotsRemaining < validatedData.guestCount) {
      return errorResponse(
        res,
        'Only ' + schedule.spotsRemaining + ' spot(s) remaining. You requested ' + validatedData.guestCount + '.',
        400
      );
    }

    const hoursUntilExperience = (schedule.startDateTime.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilExperience < schedule.experience.minimumNoticeHours) {
      return errorResponse(
        res,
        'This experience requires at least ' + schedule.experience.minimumNoticeHours + ' hours advance booking',
        400
      );
    }

    const pricePerPerson = schedule.experience.pricePerPerson;
    const subtotal = pricePerPerson * validatedData.guestCount;
    let groupDiscount = 0;

    if (schedule.experience.groupDiscount && validatedData.guestCount >= 4) {
      groupDiscount = subtotal * (schedule.experience.groupDiscount / 100);
    }

    const serviceFee = (subtotal - groupDiscount) * 0.14;
    const taxes = (subtotal - groupDiscount) * 0.08;
    const total = subtotal - groupDiscount + serviceFee + taxes;

    const booking = await prisma.booking.create({
      data: {
        guestId: userId,
        experienceId: schedule.experienceId,
        scheduleId: schedule.id,
        guestCount: validatedData.guestCount,
        guestNames: validatedData.guestNames || [],
        specialRequests: validatedData.specialRequests,
        messageToHost: validatedData.messageToHost,
        pricePerPerson,
        subtotal,
        groupDiscount,
        serviceFee,
        taxes,
        total,
        confirmationCode: uuidv4().substring(0, 8).toUpperCase(),
        status: schedule.experience.isInstantBook ? 'CONFIRMED' : 'PENDING',
      },
      include: {
        experience: {
          include: {
            host: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                photo: true,
              },
            },
            photos: {
              where: { isCover: true },
              take: 1,
            },
          },
        },
        schedule: true,
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            photo: true,
          },
        },
      },
    });

    await prisma.schedule.update({
      where: { id: schedule.id },
      data: {
        spotsRemaining: { decrement: validatedData.guestCount },
      },
    });

    await prisma.experience.update({
      where: { id: schedule.experienceId },
      data: {
        totalBookings: { increment: 1 },
      },
    });

    return successResponse(res, booking, 'Booking created successfully', 201);
  } catch (error) {
    return next(error);
  }
};

// Get user's bookings
export const getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { status } = req.query;

    const where: any = { guestId: userId };
    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        experience: {
          include: {
            host: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                photo: true,
              },
            },
            photos: {
              where: { isCover: true },
              take: 1,
            },
          },
        },
        schedule: true,
        review: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(res, bookings);
  } catch (error) {
    return next(error);
  }
};

// Get single booking
export const getBookingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        experience: {
          include: {
            host: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                photo: true,
                phone: true,
              },
            },
            photos: true,
            itinerary: {
              orderBy: { order: 'asc' },
            },
          },
        },
        schedule: true,
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            photo: true,
            phone: true,
          },
        },
        review: true,
      },
    });

    if (!booking) {
      return errorResponse(res, 'Booking not found', 404);
    }

    if (booking.guestId !== userId && booking.experience.hostId !== userId) {
      return errorResponse(res, 'You are not authorized to view this booking', 403);
    }

    return successResponse(res, booking);
  } catch (error) {
    return next(error);
  }
};

// Cancel booking
export const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const { reason } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        schedule: {
          include: {
            experience: true,
          },
        },
      },
    });

    if (!booking) {
      return errorResponse(res, 'Booking not found', 404);
    }

    if (booking.guestId !== userId) {
      return errorResponse(res, 'You are not authorized to cancel this booking', 403);
    }

    if (booking.status === 'CANCELLED') {
      return errorResponse(res, 'Booking is already cancelled', 400);
    }

    if (booking.status === 'COMPLETED') {
      return errorResponse(res, 'Cannot cancel a completed booking', 400);
    }

    const hoursUntilExperience =
      (booking.schedule.startDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

    if (hoursUntilExperience < booking.schedule.experience.cancellationDeadlineHours) {
      const msg = 'Cancellation deadline has passed. Must cancel at least ' +
        booking.schedule.experience.cancellationDeadlineHours + ' hours before the experience.';
      return errorResponse(res, msg, 400);
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledBy: userId,
        cancellationReason: reason,
        cancelledAt: new Date(),
      },
      include: {
        experience: true,
        schedule: true,
      },
    });

    await prisma.schedule.update({
      where: { id: booking.scheduleId },
      data: {
        spotsRemaining: { increment: booking.guestCount },
      },
    });

    await prisma.experience.update({
      where: { id: booking.experienceId },
      data: {
        totalBookings: { decrement: 1 },
      },
    });

    return successResponse(res, updatedBooking, 'Booking cancelled successfully');
  } catch (error) {
    return next(error);
  }
};

// Get bookings for host's experiences
export const getHostBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { status } = req.query;

    const where: any = {
      experience: {
        hostId: userId,
      },
    };

    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            photo: true,
          },
        },
        experience: {
          select: {
            id: true,
            title: true,
            photos: {
              where: { isCover: true },
              take: 1,
            },
          },
        },
        schedule: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(res, bookings);
  } catch (error) {
    return next(error);
  }
};

// Confirm booking
export const confirmBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        experience: true,
      },
    });

    if (!booking) {
      return errorResponse(res, 'Booking not found', 404);
    }

    if (booking.experience.hostId !== userId) {
      return errorResponse(res, 'You are not authorized to confirm this booking', 403);
    }

    if (booking.status !== 'PENDING') {
      return errorResponse(res, 'Only pending bookings can be confirmed', 400);
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
      },
      include: {
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        experience: true,
        schedule: true,
      },
    });

    return successResponse(res, updatedBooking, 'Booking confirmed successfully');
  } catch (error) {
    return next(error);
  }
};
