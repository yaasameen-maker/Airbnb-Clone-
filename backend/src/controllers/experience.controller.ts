import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { validate, createExperienceSchema, updateExperienceSchema, createScheduleSchema, searchExperiencesSchema } from '../utils/validation';
import { successResponse, errorResponse } from '../utils/response';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload';

// Create a new experience
export const createExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = validate(createExperienceSchema, req.body);
    const userId = req.user!.userId;

    const experience = await prisma.experience.create({
      data: {
        ...validatedData,
        hostId: userId,
        status: 'DRAFT',
      },
      include: {
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photo: true,
          },
        },
      },
    });

    return successResponse(res, experience, 'Experience created successfully', 201);
  } catch (error) {
    return next(error);
  }
};

// Get all experiences with search and filters
export const getExperiences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = validate(searchExperiencesSchema, {
      ...req.query,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
      maxGuests: req.query.maxGuests ? Number(req.query.maxGuests) : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    });

    const { query, category, city, country, minPrice, maxPrice, minRating, maxGuests, type, sortBy } = validated;
    const page = validated.page!;
    const limit = validated.limit!;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: 'ACTIVE',
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (country) {
      where.country = { contains: country, mode: 'insensitive' };
    }

    if (type) {
      where.type = type;
    }

    if (minPrice || maxPrice) {
      where.pricePerPerson = {};
      if (minPrice) where.pricePerPerson.gte = minPrice;
      if (maxPrice) where.pricePerPerson.lte = maxPrice;
    }

    if (minRating) {
      where.averageRating = { gte: minRating };
    }

    if (maxGuests) {
      where.maxGuests = { gte: maxGuests };
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'price':
        orderBy = { pricePerPerson: 'asc' };
        break;
      case 'rating':
        orderBy = { averageRating: 'desc' };
        break;
      case 'popular':
        orderBy = { totalBookings: 'desc' };
        break;
      case 'recent':
        orderBy = { publishedAt: 'desc' };
        break;
      default:
        orderBy = { totalBookings: 'desc' };
    }

    const [experiences, total] = await Promise.all([
      prisma.experience.findMany({
        where,
        skip,
        take: limit,
        orderBy,
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
          _count: {
            select: {
              reviews: true,
              bookings: true,
            },
          },
        },
      }),
      prisma.experience.count({ where }),
    ]);

    return successResponse(res, {
      experiences,
      pagination: {
        total,
        page,
        limit,
        totalPages:Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Get single experience by ID
export const getExperienceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photo: true,
            bio: true,
            createdAt: true,
          },
        },
        photos: {
          orderBy: { order: 'asc' },
        },
        itinerary: {
          orderBy: { order: 'asc' },
        },
        schedules: {
          where: {
            status: 'AVAILABLE',
            startDateTime: {
              gte: new Date(),
            },
          },
          orderBy: {
            startDateTime: 'asc',
          },
          take: 10,
        },
        reviews: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            reviews: true,
            bookings: true,
          },
        },
      },
    });

    if (!experience) {
      return errorResponse(res, 'Experience not found', 404);
    }

    // Increment view count
    await prisma.experience.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return successResponse(res, experience);
  } catch (error) {
    return next(error);
  }
};

// Update an experience
export const updateExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = validate(updateExperienceSchema, req.body);
    const userId = req.user!.userId;

    const experience = await prisma.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      return errorResponse(res, 'Experience not found', 404);
    }

    if (experience.hostId !== userId) {
      return errorResponse(res, 'You are not authorized to update this experience', 403);
    }

    const updatedExperience = await prisma.experience.update({
      where: { id },
      data: validatedData,
      include: {
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photo: true,
          },
        },
        photos: true,
        itinerary: true,
      },
    });

    return successResponse(res, updatedExperience, 'Experience updated successfully');
  } catch (error) {
    return next(error);
  }
};

// Delete an experience
export const deleteExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        photos: true,
      },
    });

    if (!experience) {
      return errorResponse(res, 'Experience not found', 404);
    }

    if (experience.hostId !== userId) {
      return errorResponse(res, 'You are not authorized to delete this experience', 403);
    }

    // Delete photos from Cloudinary
    for (const photo of experience.photos) {
      await deleteFromCloudinary(photo.publicId);
    }

    await prisma.experience.delete({
      where: { id },
    });

    return successResponse(res, null, 'Experience deleted successfully');
  } catch (error) {
    return next(error);
  }
};

// Upload experience photos
export const uploadExperiencePhotos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return errorResponse(res, 'No files uploaded', 400);
    }

    const experience = await prisma.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      return errorResponse(res, 'Experience not found', 404);
    }

    if (experience.hostId !== userId) {
      return errorResponse(res, 'You are not authorized to update this experience', 403);
    }

    const currentPhotoCount = await prisma.experiencePhoto.count({
      where: { experienceId: id },
    });

    const uploadPromises = files.map(async (file, index) => {
      const folderName = 'experiences/' + id;
      const { url, publicId } = await uploadToCloudinary(file.buffer, folderName);

      return prisma.experiencePhoto.create({
        data: {
          experienceId: id,
          url,
          publicId,
          order: currentPhotoCount + index,
          isCover: currentPhotoCount === 0 && index === 0,
        },
      });
    });

    const photos = await Promise.all(uploadPromises);

    return successResponse(res, photos, 'Photos uploaded successfully', 201);
  } catch (error) {
    return next(error);
  }
};

// Delete experience photo
export const deleteExperiencePhoto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, photoId } = req.params;
    const userId = req.user!.userId;

    const experience = await prisma.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      return errorResponse(res, 'Experience not found', 404);
    }

    if (experience.hostId !== userId) {
      return errorResponse(res, 'You are not authorized to update this experience', 403);
    }

    const photo = await prisma.experiencePhoto.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      return errorResponse(res, 'Photo not found', 404);
    }

    await deleteFromCloudinary(photo.publicId);
    await prisma.experiencePhoto.delete({
      where: { id: photoId },
    });

    return successResponse(res, null, 'Photo deleted successfully');
  } catch (error) {
    return next(error);
  }
};

// Create schedule for experience
export const createSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = validate(createScheduleSchema, req.body);
    const userId = req.user!.userId;

    const experience = await prisma.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      return errorResponse(res, 'Experience not found', 404);
    }

    if (experience.hostId !== userId) {
      return errorResponse(res, 'You are not authorized to update this experience', 403);
    }

    const schedule = await prisma.schedule.create({
      data: {
        experienceId: id,
        ...validatedData,
        spotsRemaining: validatedData.maxSpots,
      },
    });

    return successResponse(res, schedule, 'Schedule created successfully', 201);
  } catch (error) {
    return next(error);
  }
};

// Get host's experiences
export const getMyExperiences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const experiences = await prisma.experience.findMany({
      where: { hostId: userId },
      include: {
        photos: {
          where: { isCover: true },
          take: 1,
        },
        _count: {
          select: {
            reviews: true,
            bookings: true,
            schedules: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(res, experiences);
  } catch (error) {
    return next(error);
  }
};
