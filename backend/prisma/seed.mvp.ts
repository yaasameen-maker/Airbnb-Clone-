import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting MVP seed...');

  // Clear existing data
  await prisma.experiencePhoto.deleteMany({});
  await prisma.itineraryStep.deleteMany({});
  await prisma.schedule.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✅ Cleared existing data');

  // Create users
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const host1 = await prisma.user.create({
    data: {
      email: 'maria@airbnb.com',
      password: hashedPassword,
      firstName: 'Maria',
      lastName: 'Rodriguez',
      role: 'HOST',
      phone: '+1-555-0101',
      emailVerified: true,
      phoneVerified: true,
      bio: 'Born and raised in NYC, I love sharing my city with visitors! Professional food tour guide for 5+ years.',
      hometown: 'New York, NY',
      languages: ['English', 'Spanish'],
      interests: ['Food', 'History', 'Photography'],
    },
  });

  const host2 = await prisma.user.create({
    data: {
      email: 'kenji@airbnb.com',
      password: hashedPassword,
      firstName: 'Kenji',
      lastName: 'Tanaka',
      role: 'HOST',
      phone: '+1-555-0102',
      emailVerified: true,
      phoneVerified: true,
      bio: 'Tokyo native living in San Francisco. Sushi chef and cultural ambassador sharing Japanese traditions.',
      hometown: 'San Francisco, CA',
      languages: ['English', 'Japanese'],
      interests: ['Cooking', 'Culture', 'Art'],
    },
  });

  const host3 = await prisma.user.create({
    data: {
      email: 'sophie@airbnb.com',
      password: hashedPassword,
      firstName: 'Sophie',
      lastName: 'Martin',
      role: 'HOST',
      phone: '+1-555-0103',
      emailVerified: true,
      phoneVerified: true,
      bio: 'Professional yoga instructor and wellness coach. Helping people find balance and inner peace.',
      hometown: 'Los Angeles, CA',
      languages: ['English', 'French'],
      interests: ['Wellness', 'Meditation', 'Nature'],
    },
  });

  const guest1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Smith',
      role: 'GUEST',
      emailVerified: true,
      bio: 'Travel enthusiast exploring the world one experience at a time.',
      hometown: 'Chicago, IL',
      languages: ['English'],
      interests: ['Travel', 'Photography', 'Food'],
    },
  });

  const guest2 = await prisma.user.create({
    data: {
      email: 'emma@example.com',
      password: hashedPassword,
      firstName: 'Emma',
      lastName: 'Johnson',
      role: 'GUEST',
      emailVerified: true,
      bio: 'Adventure seeker always looking for unique local experiences.',
      hometown: 'Austin, TX',
      languages: ['English'],
      interests: ['Adventure', 'Art', 'Culture'],
    },
  });

  console.log('✅ Created 5 users (3 hosts, 2 guests)');

  // Experience 1: NYC Food Tour
  const exp1 = await prisma.experience.create({
    data: {
      hostId: host1.id,
      title: 'NYC Food Tour: Taste of Little Italy & Chinatown',
      tagline: 'Discover authentic flavors with a local foodie',
      description:
        'Join me for an unforgettable 3-hour culinary journey through two of New York City\'s most vibrant neighborhoods. We\'ll explore hidden gems, sample authentic dishes, and learn the fascinating history behind each location. From fresh-made mozzarella to hand-pulled noodles, this tour is a feast for all your senses!',
      category: 'FOOD_DRINK',
      type: 'IN_PERSON',
      duration: 180,
      maxGuests: 8,
      language: 'English',
      skillLevel: 'Beginner',
      address: '123 Mulberry Street',
      city: 'New York',
      country: 'United States',
      latitude: 40.7178,
      longitude: -73.9968,
      meetingPoint: 'Little Italy Visitor Center (corner of Mulberry & Grand)',
      pricePerPerson: 75,
      groupDiscount: 10,
      requirements: ['18 years or older', 'Comfortable walking shoes', 'Empty stomach!'],
      included: ['Food samples at 6 locations', 'Bottled water', 'Local guide', 'Recipe cards'],
      toBring: ['Camera', 'Appetite', 'Weather-appropriate clothing'],
      cancellationDeadlineHours: 24,
      minimumNoticeHours: 12,
      isInstantBook: true,
      status: 'ACTIVE',
      publishedAt: new Date(),
      averageRating: 4.8,
      totalReviews: 156,
      totalBookings: 189,
      guestFavorite: true,
      itinerary: {
        create: [
          {
            order: 1,
            title: 'Welcome & Italian Pastries',
            description: 'Meet at the visitor center and start with fresh cannoli from a 100-year-old bakery',
            duration: 30,
          },
          {
            order: 2,
            title: 'Fresh Mozzarella Making',
            description: 'Watch artisans make mozzarella by hand and taste the difference',
            duration: 25,
          },
          {
            order: 3,
            title: 'Traditional Dim Sum',
            description: 'Cross into Chinatown for steaming baskets of authentic dumplings',
            duration: 40,
          },
          {
            order: 4,
            title: 'Tea Tasting Experience',
            description: 'Learn about Chinese tea culture while sampling 3 varieties',
            duration: 30,
          },
          {
            order: 5,
            title: 'Hidden Street Food Gems',
            description: 'Discover local favorites tourists never find',
            duration: 35,
          },
        ],
      },
      photos: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
            publicId: 'exp1_cover',
            order: 0,
            isCover: true,
          },
          {
            url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800',
            publicId: 'exp1_photo1',
            order: 1,
          },
          {
            url: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800',
            publicId: 'exp1_photo2',
            order: 2,
          },
        ],
      },
    },
  });

  // Experience 2: Sushi Making Class
  const exp2 = await prisma.experience.create({
    data: {
      hostId: host2.id,
      title: 'Master Sushi Making with a Japanese Chef',
      tagline: 'Learn authentic techniques from a Tokyo-trained chef',
      description:
        'Discover the art of sushi making in this hands-on class! As a chef trained in Tokyo, I\'ll teach you traditional techniques for making nigiri, maki rolls, and more. You\'ll learn knife skills, rice preparation, and the secrets to perfect sushi. Best of all, you get to enjoy your creations!',
      category: 'FOOD_DRINK',
      type: 'IN_PERSON',
      duration: 150,
      maxGuests: 10,
      language: 'English',
      skillLevel: 'Beginner',
      address: '456 Market Street',
      city: 'San Francisco',
      country: 'United States',
      latitude: 37.7749,
      longitude: -122.4194,
      meetingPoint: 'SF Culinary Studio - Main Entrance',
      pricePerPerson: 95,
      groupDiscount: 15,
      requirements: ['Must be 16+', 'No shellfish allergies'],
      included: ['All ingredients', 'Chef tools', 'Apron to keep', 'Recipe booklet', 'Sake tasting'],
      toBring: ['Hair tie if long hair', 'Camera optional'],
      cancellationDeadlineHours: 48,
      minimumNoticeHours: 24,
      isInstantBook: true,
      status: 'ACTIVE',
      publishedAt: new Date(),
      averageRating: 4.9,
      totalReviews: 203,
      totalBookings: 245,
      guestFavorite: true,
      airbnbOriginal: true,
      itinerary: {
        create: [
          {
            order: 1,
            title: 'Introduction to Sushi',
            description: 'Learn about sushi history and the ingredients we\'ll use',
            duration: 15,
          },
          {
            order: 2,
            title: 'Rice Preparation',
            description: 'Master the perfect sushi rice - the foundation of great sushi',
            duration: 20,
          },
          {
            order: 3,
            title: 'Knife Skills',
            description: 'Learn proper cutting techniques for fish and vegetables',
            duration: 25,
          },
          {
            order: 4,
            title: 'Making Nigiri',
            description: 'Create beautiful hand-formed sushi pieces',
            duration: 30,
          },
          {
            order: 5,
            title: 'Rolling Maki',
            description: 'Master the bamboo mat and create perfect rolls',
            duration: 35,
          },
          {
            order: 6,
            title: 'Enjoy Your Creations',
            description: 'Sit down and enjoy what you\'ve made with sake pairing',
            duration: 25,
          },
        ],
      },
      photos: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
            publicId: 'exp2_cover',
            order: 0,
            isCover: true,
          },
          {
            url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800',
            publicId: 'exp2_photo1',
            order: 1,
          },
          {
            url: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800',
            publicId: 'exp2_photo2',
            order: 2,
          },
        ],
      },
    },
  });

  // Experience 3: Sunrise Yoga & Meditation
  const exp3 = await prisma.experience.create({
    data: {
      hostId: host3.id,
      title: 'Sunrise Yoga & Meditation on the Beach',
      tagline: 'Start your day with peace and ocean views',
      description:
        'Wake up to a magical morning practice on Venice Beach! This 90-minute session combines gentle yoga flows with guided meditation, all while watching the sunrise over the Pacific. Perfect for all levels - whether you\'re a beginner or experienced practitioner. Leave feeling energized and centered for the day ahead.',
      category: 'WELLNESS',
      type: 'IN_PERSON',
      duration: 90,
      maxGuests: 15,
      language: 'English',
      skillLevel: 'All levels',
      fitnessLevel: 'Easy',
      address: 'Venice Beach',
      city: 'Los Angeles',
      country: 'United States',
      latitude: 33.9850,
      longitude: -118.4695,
      meetingPoint: 'Venice Beach Boardwalk - Lifeguard Tower 20',
      pricePerPerson: 45,
      groupDiscount: 10,
      requirements: ['Must be 18+', 'Basic mobility'],
      included: ['Yoga mat', 'Beach towel', 'Water bottle', 'Light snack'],
      toBring: ['Comfortable clothing', 'Sunscreen', 'Open mind'],
      accessibility: ['Wheelchair accessible meeting point', 'Modifications available'],
      cancellationDeadlineHours: 12,
      minimumNoticeHours: 8,
      isInstantBook: true,
      status: 'ACTIVE',
      publishedAt: new Date(),
      averageRating: 5.0,
      totalReviews: 89,
      totalBookings: 102,
      guestFavorite: true,
      itinerary: {
        create: [
          {
            order: 1,
            title: 'Arrival & Setup',
            description: 'Get your mat and find the perfect spot on the sand',
            duration: 10,
          },
          {
            order: 2,
            title: 'Breathing & Centering',
            description: 'Connect with your breath and set intentions',
            duration: 15,
          },
          {
            order: 3,
            title: 'Sunrise Flow',
            description: 'Gentle vinyasa sequence welcoming the new day',
            duration: 40,
          },
          {
            order: 4,
            title: 'Guided Meditation',
            description: 'Deep relaxation with ocean sounds',
            duration: 20,
          },
          {
            order: 5,
            title: 'Closing & Refreshments',
            description: 'Share reflections and enjoy healthy snacks',
            duration: 5,
          },
        ],
      },
      photos: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
            publicId: 'exp3_cover',
            order: 0,
            isCover: true,
          },
          {
            url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
            publicId: 'exp3_photo1',
            order: 1,
          },
          {
            url: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800',
            publicId: 'exp3_photo2',
            order: 2,
          },
        ],
      },
    },
  });

  console.log('✅ Created 3 active experiences');

  // Create schedules for next 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // NYC Food Tour - Daily at 11 AM and 3 PM
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    // Morning tour
    const morning = new Date(date);
    morning.setHours(11, 0, 0, 0);
    const morningEnd = new Date(morning);
    morningEnd.setHours(14, 0, 0, 0);

    await prisma.schedule.create({
      data: {
        experienceId: exp1.id,
        startDateTime: morning,
        endDateTime: morningEnd,
        maxSpots: 8,
        spotsRemaining: i === 0 ? 2 : 8, // First one almost booked
        status: 'AVAILABLE',
      },
    });

    // Afternoon tour
    const afternoon = new Date(date);
    afternoon.setHours(15, 0, 0, 0);
    const afternoonEnd = new Date(afternoon);
    afternoonEnd.setHours(18, 0, 0, 0);

    await prisma.schedule.create({
      data: {
        experienceId: exp1.id,
        startDateTime: afternoon,
        endDateTime: afternoonEnd,
        maxSpots: 8,
        spotsRemaining: 8,
        status: 'AVAILABLE',
      },
    });
  }

  // Sushi Class - Tue, Thu, Sat at 6 PM
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 6) {
      // Tue, Thu, Sat
      const classTime = new Date(date);
      classTime.setHours(18, 0, 0, 0);
      const classEnd = new Date(classTime);
      classEnd.setHours(20, 30, 0, 0);

      await prisma.schedule.create({
        data: {
          experienceId: exp2.id,
          startDateTime: classTime,
          endDateTime: classEnd,
          maxSpots: 10,
          spotsRemaining: 10,
          status: 'AVAILABLE',
        },
      });
    }
  }

  // Sunrise Yoga - Every morning at 6 AM
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    const sunrise = new Date(date);
    sunrise.setHours(6, 0, 0, 0);
    const sunriseEnd = new Date(sunrise);
    sunriseEnd.setHours(7, 30, 0, 0);

    await prisma.schedule.create({
      data: {
        experienceId: exp3.id,
        startDateTime: sunrise,
        endDateTime: sunriseEnd,
        maxSpots: 15,
        spotsRemaining: i === 1 ? 10 : 15, // One session partially booked
        status: 'AVAILABLE',
      },
    });
  }

  console.log('✅ Created schedules for next 7-14 days');

  console.log('\n🎉 MVP Seed complete!');
  console.log('\n📧 Test Accounts:');
  console.log('   Hosts:');
  console.log('   - maria@airbnb.com (NYC Food Tour)');
  console.log('   - kenji@airbnb.com (Sushi Class)');
  console.log('   - sophie@airbnb.com (Yoga & Meditation)');
  console.log('   Guests:');
  console.log('   - john@example.com');
  console.log('   - emma@example.com');
  console.log('   Password for all: Password123!');
  console.log('\n🏆 3 Premium Experiences ready to explore!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
