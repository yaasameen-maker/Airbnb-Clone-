import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.experiencePhoto.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.user.deleteMany();

  // Create host users
  console.log('👥 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.create({
    data: {
      email: 'admin@airbnb.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  const hosts = await Promise.all([
    prisma.user.create({
      data: {
        email: 'maria.rodriguez@host.com',
        password: hashedPassword,
        firstName: 'Maria',
        lastName: 'Rodriguez',
        role: 'HOST',
        bio: 'Local guide with 10+ years of experience showing travelers the best of San Juan',
      },
    }),
    prisma.user.create({
      data: {
        email: 'david.chen@host.com',
        password: hashedPassword,
        firstName: 'David',
        lastName: 'Chen',
        role: 'HOST',
        bio: 'New York native and certified tour guide passionate about the city\'s hidden gems',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sofia.gonzalez@host.com',
        password: hashedPassword,
        firstName: 'Sofia',
        lastName: 'Gonzalez',
        role: 'HOST',
        bio: 'Mexico City local and culinary expert sharing authentic Mexican culture',
      },
    }),
    prisma.user.create({
      data: {
        email: 'james.wilson@host.com',
        password: hashedPassword,
        firstName: 'James',
        lastName: 'Wilson',
        role: 'HOST',
        bio: 'Adventure enthusiast and certified scuba instructor',
      },
    }),
    prisma.user.create({
      data: {
        email: 'isabella.santos@host.com',
        password: hashedPassword,
        firstName: 'Isabella',
        lastName: 'Santos',
        role: 'HOST',
        bio: 'Yoga instructor and wellness coach with a passion for beach meditation',
      },
    }),
  ]);

  const regularUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'user1@example.com',
        password: hashedPassword,
        firstName: 'Alice',
        lastName: 'Johnson',
        role: 'GUEST',
      },
    }),
    prisma.user.create({
      data: {
        email: 'user2@example.com',
        password: hashedPassword,
        firstName: 'Bob',
        lastName: 'Smith',
        role: 'GUEST',
      },
    }),
    prisma.user.create({
      data: {
        email: 'user3@example.com',
        password: hashedPassword,
        firstName: 'Carol',
        lastName: 'White',
        role: 'GUEST',
      },
    }),
  ]);

  // Create experiences
  console.log('🎭 Creating experiences...');

  // San Juan Experiences
  const exp1 = await prisma.experience.create({
    data: {
      title: "Explore El Yunque's Waterfalls & Transportation",
      description: "Join me for an unforgettable journey through Puerto Rico's famous El Yunque rainforest. We'll hike to stunning waterfalls, swim in natural pools, and explore the lush tropical landscape. Transportation included from San Juan.",
      category: 'NATURE_OUTDOORS',
      pricePerPerson: 45,
      duration: 360,
      maxGuests: 8,
      city: 'San Juan',
      country: 'Puerto Rico',
      language: 'English',
      hostId: hosts[0].id,
      status: 'ACTIVE',
      included: ['Transportation from San Juan', 'Water and snacks', 'Professional guide', 'Safety equipment'],
      requirements: ['Comfortable hiking shoes', 'Swimwear'],
    },
  });

  const exp2 = await prisma.experience.create({
    data: {
      title: 'Transport to El Yunque Waterslide & Waterfalls',
      description: 'Experience the natural waterslide at El Yunque! Slide down smooth rocks into crystal-clear pools. This adventure is perfect for thrill-seekers and nature lovers alike.',
      category: 'NATURE_OUTDOORS',
      pricePerPerson: 32,
      duration: 300,
      maxGuests: 10,
      city: 'El Yunque',
      country: 'Puerto Rico',
      language: 'English',
      hostId: hosts[0].id,
      status: 'ACTIVE',
      included: ['Round-trip transportation', 'Bottled water', 'First aid kit'],
      requirements: ['Able to swim'],
    },
  });

  const exp3 = await prisma.experience.create({
    data: {
      title: 'Snorkeling Adventure',
      description: 'Discover the underwater world of Puerto Rico! Snorkel in crystal-clear waters teeming with colorful fish, sea turtles, and vibrant coral reefs. Perfect for beginners and experienced snorkelers.',
      category: 'NATURE_OUTDOORS',
      pricePerPerson: 49,
      duration: 180,
      maxGuests: 6,
      city: 'Fajardo',
      country: 'Puerto Rico',
      language: 'English',
      hostId: hosts[3].id,
      status: 'ACTIVE',
      included: ['Snorkeling gear', 'Life jackets', 'Underwater guide', 'Photos of your adventure'],
      requirements: ['Able to swim', 'No fear of water'],
    },
  });

  const exp4 = await prisma.experience.create({
    data: {
      title: 'Beach Yoga, Meditation, and Sound Bath by the Sea',
      description: 'Start your day with sunrise yoga on the beach, followed by guided meditation and a relaxing sound bath with crystal singing bowls. Connect with nature and find your inner peace.',
      category: 'WELLNESS',
      pricePerPerson: 25,
      duration: 120,
      maxGuests: 12,
      city: 'Isla Verde',
      country: 'Puerto Rico',
      language: 'English',
      hostId: hosts[4].id,
      status: 'ACTIVE',
      included: ['Yoga mat', 'Meditation cushion', 'Herbal tea'],
      skillLevel: 'Beginner',
    },
  });

  const exp5 = await prisma.experience.create({
    data: {
      title: 'Sunset Salsa Beach Class',
      description: 'Learn to dance salsa as the sun sets over the Caribbean! Our experienced instructor will teach you the basics and have you dancing like a local. No experience necessary!',
      category: 'ENTERTAINMENT',
      pricePerPerson: 29,
      duration: 120,
      maxGuests: 20,
      city: 'San Juan',
      country: 'Puerto Rico',
      language: 'English, Spanish',
      hostId: hosts[0].id,
      status: 'ACTIVE',
      included: ['Professional dance instruction', 'Welcome drink', 'Music and sound system'],
      skillLevel: 'Beginner',
    },
  });

  const exp6 = await prisma.experience.create({
    data: {
      title: 'Rainforest Waterslide El Yunque Food n Transport',
      description: 'The ultimate El Yunque experience! Waterslide adventure plus authentic Puerto Rican lunch. Slide down natural rock formations, swim in waterfalls, and enjoy delicious local food.',
      category: 'FOOD_DRINK',
      pricePerPerson: 49,
      duration: 420,
      maxGuests: 8,
      city: 'El Yunque',
      country: 'Puerto Rico',
      language: 'English',
      hostId: hosts[0].id,
      status: 'ACTIVE',
      included: ['Round-trip transportation', 'Authentic lunch', 'Water and snacks', 'Guide'],
    },
  });

  // New York Experiences
  const exp7 = await prisma.experience.create({
    data: {
      title: 'The Full-Day "See It All" NYC Tour',
      description: 'See all of New York City\'s iconic landmarks in one day! From the Statue of Liberty to Central Park, Brooklyn Bridge to Times Square. Perfect for first-time visitors.',
      category: 'SIGHTSEEING',
      pricePerPerson: 79,
      duration: 480,
      maxGuests: 15,
      city: 'New York',
      country: 'USA',
      language: 'English',
      hostId: hosts[1].id,
      status: 'ACTIVE',
      included: ['MetroCard for subway', 'Food tastings', 'Expert guide', 'Photo opportunities'],
    },
  });

  const exp8 = await prisma.experience.create({
    data: {
      title: 'Explore Hasidic Brooklyn with a Local Rabbi',
      description: 'Get an insider\'s view of Brooklyn\'s Hasidic community. Learn about traditions, visit a synagogue, sample kosher food, and ask questions in a respectful, educational setting.',
      category: 'ARTS_CULTURE',
      pricePerPerson: 69,
      duration: 180,
      maxGuests: 8,
      city: 'Brooklyn',
      country: 'USA',
      language: 'English',
      hostId: hosts[1].id,
      status: 'ACTIVE',
      included: ['Kosher food tastings', 'Synagogue visit', 'Educational materials'],
    },
  });

  const exp9 = await prisma.experience.create({
    data: {
      title: 'Learn Mahjong and Sip Tea',
      description: 'Discover the ancient Chinese game of Mahjong in a cozy tea house. Learn the rules, strategy, and cultural significance while enjoying traditional Chinese tea.',
      category: 'FOOD_DRINK',
      pricePerPerson: 55,
      duration: 150,
      maxGuests: 6,
      city: 'New York',
      country: 'USA',
      language: 'English',
      hostId: hosts[1].id,
      status: 'ACTIVE',
      included: ['Mahjong set', 'Premium Chinese tea', 'Light snacks', 'Take-home game guide'],
      skillLevel: 'Beginner',
    },
  });

  const exp10 = await prisma.experience.create({
    data: {
      title: 'Explore New York Mafia w/ Retired NYPD Detectives',
      description: 'Walk through NYC\'s mob history with retired detectives who investigated organized crime. Visit famous locations, hear real stories, and learn about the city\'s underworld.',
      category: 'ARTS_CULTURE',
      pricePerPerson: 89,
      duration: 180,
      maxGuests: 12,
      city: 'Manhattan',
      country: 'USA',
      language: 'English',
      hostId: hosts[1].id,
      status: 'ACTIVE',
      included: ['Expert detective guide', 'Historic photos', 'Walking tour map'],
    },
  });

  const exp11 = await prisma.experience.create({
    data: {
      title: 'Spray Paint in Bushwick with a Local Street Artist',
      description: 'Create your own street art masterpiece! Learn spray paint techniques from a professional street artist in Brooklyn\'s vibrant Bushwick neighborhood.',
      category: 'ARTS_CULTURE',
      pricePerPerson: 45,
      duration: 120,
      maxGuests: 6,
      city: 'Brooklyn',
      country: 'USA',
      language: 'English',
      hostId: hosts[1].id,
      status: 'ACTIVE',
      included: ['Canvas', 'Spray paints', 'Protective gear', 'Take home your art'],
      skillLevel: 'Beginner',
    },
  });

  const exp12 = await prisma.experience.create({
    data: {
      title: 'The Ultimate Greenwich Village Food Tour',
      description: 'Taste your way through Greenwich Village! Sample pizza, Italian pastries, artisanal coffee, and other local favorites while learning about the neighborhood\'s rich history.',
      category: 'FOOD_DRINK',
      pricePerPerson: 79,
      duration: 180,
      maxGuests: 10,
      city: 'New York',
      country: 'USA',
      language: 'English',
      hostId: hosts[1].id,
      status: 'ACTIVE',
      included: ['All food tastings', 'Bottled water', 'Walking tour', 'Restaurant recommendations'],
    },
  });

  // Airbnb Originals - NYC
  const exp13 = await prisma.experience.create({
    data: {
      title: "Trace Harlem Monuments' Impact with a Historian",
      description: 'Explore Harlem\'s monumental history with a professional historian. Visit landmarks of the Harlem Renaissance and learn about influential figures who shaped American culture.',
      category: 'ARTS_CULTURE',
      pricePerPerson: 50,
      duration: 150,
      maxGuests: 10,
      city: 'New York',
      country: 'USA',
      language: 'English',
      hostId: hosts[1].id,
      status: 'ACTIVE',
      airbnbOriginal: true,
      included: ['Expert guide', 'Historic photos', 'Walking tour map'],
    },
  });

  const exp14 = await prisma.experience.create({
    data: {
      title: 'Find Your Signature Scent with a Perfumer',
      description: 'Work with a professional perfumer to create your own custom fragrance. Learn about scent notes, perfume composition, and take home your unique creation.',
      category: 'ARTS_CULTURE',
      pricePerPerson: 80,
      duration: 120,
      maxGuests: 6,
      city: 'New York',
      country: 'USA',
      language: 'English',
      hostId: hosts[1].id,
      status: 'ACTIVE',
      airbnbOriginal: true,
      included: ['All materials', '50ml custom perfume', 'Scent profile guide', 'Champagne toast'],
    },
  });

  const exp15 = await prisma.experience.create({
    data: {
      title: 'Queer Literary History Walk in Greenwich Village',
      description: 'Discover Greenwich Village\'s rich LGBTQ+ literary history. Visit homes and haunts of famous queer writers and poets who shaped American literature.',
      category: 'ARTS_CULTURE',
      pricePerPerson: 60,
      duration: 150,
      maxGuests: 12,
      city: 'New York',
      country: 'USA',
      language: 'English',
      hostId: hosts[1].id,
      status: 'ACTIVE',
      included: ['Expert guide', 'Reading excerpts', 'Book recommendations'],
    },
  });

  const exp16 = await prisma.experience.create({
    data: {
      title: 'Sketch Masterpieces at the Met Museum',
      description: 'Learn to sketch like the masters! An artist will guide you through the Metropolitan Museum, teaching drawing techniques inspired by famous artworks.',
      category: 'ARTS_CULTURE',
      pricePerPerson: 55,
      duration: 180,
      maxGuests: 8,
      city: 'New York',
      country: 'USA',
      language: 'English',
      hostId: hosts[1].id,
      status: 'ACTIVE',
      included: ['Sketchbook', 'Drawing materials', 'Museum admission', 'Artist instruction'],
      skillLevel: 'Beginner',
    },
  });

  const exp17 = await prisma.experience.create({
    data: {
      title: 'Explore Chelsea Galleries with an Art Historian',
      description: 'Tour Chelsea\'s contemporary art galleries with an art historian. See cutting-edge exhibitions and learn about current trends in the art world.',
      category: 'ARTS_CULTURE',
      pricePerPerson: 500,
      duration: 180,
      maxGuests: 1,
      city: 'New York',
      country: 'USA',
      language: 'English',
      hostId: hosts[1].id,
      status: 'ACTIVE',
      airbnbOriginal: true,
      included: ['Private guide', 'Gallery admissions', 'Art world insights', 'Curator introductions'],
    },
  });

  const exp18 = await prisma.experience.create({
    data: {
      title: 'Learn Boxing with a National Champion Boxer',
      description: 'Train with a former national champion! Learn proper boxing technique, get a great workout, and hear stories from a professional boxing career.',
      category: 'SPORTS',
      pricePerPerson: 100,
      duration: 90,
      maxGuests: 4,
      city: 'New York',
      country: 'USA',
      language: 'English',
      hostId: hosts[1].id,
      status: 'ACTIVE',
      included: ['Boxing gloves', 'Hand wraps', 'Water', 'Training session'],
      fitnessLevel: 'Moderate',
    },
  });

  console.log('✅ Experiences created successfully!');

  // Add photos to experiences
  console.log('📸 Adding experience photos...');
  
  await Promise.all([
    prisma.experiencePhoto.create({
      data: {
        experienceId: exp1.id,
        url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
        publicId: 'yunque_waterfall',
        order: 1,
        isCover: true,
      },
    }),
    prisma.experiencePhoto.create({
      data: {
        experienceId: exp2.id,
        url: 'https://images.unsplash.com/photo-1583886266656-6ef814095e9e?w=800',
        publicId: 'yunque_slide',
        order: 1,
        isCover: true,
      },
    }),
    prisma.experiencePhoto.create({
      data: {
        experienceId: exp3.id,
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        publicId: 'snorkel',
        order: 1,
        isCover: true,
      },
    }),
    prisma.experiencePhoto.create({
      data: {
        experienceId: exp4.id,
        url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
        publicId: 'yoga_beach',
        order: 1,
        isCover: true,
      },
    }),
    prisma.experiencePhoto.create({
      data: {
        experienceId: exp5.id,
        url: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800',
        publicId: 'salsa',
        order: 1,
        isCover: true,
      },
    }),
    prisma.experiencePhoto.create({
      data: {
        experienceId: exp6.id,
        url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
        publicId: 'food_tour',
        order: 1,
        isCover: true,
      },
    }),
    prisma.experiencePhoto.create({
      data: {
        experienceId: exp7.id,
        url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
        publicId: 'nyc_tour',
        order: 1,
        isCover: true,
      },
    }),
    prisma.experiencePhoto.create({
      data: {
        experienceId: exp8.id,
        url: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=800',
        publicId: 'brooklyn',
        order: 1,
        isCover: true,
      },
    }),
    prisma.experiencePhoto.create({
      data: {
        experienceId: exp9.id,
        url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800',
        publicId: 'mahjong',
        order: 1,
        isCover: true,
      },
    }),
    prisma.experiencePhoto.create({
      data: {
        experienceId: exp10.id,
        url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800',
        publicId: 'mafia_tour',
        order: 1,
        isCover: true,
      },
    }),
    prisma.experiencePhoto.create({
      data: {
        experienceId: exp11.id,
        url: 'https://images.unsplash.com/photo-1561998338-13ad7883b21f?w=800',
        publicId: 'street_art',
        order: 1,
        isCover: true,
      },
    }),
    prisma.experiencePhoto.create({
      data: {
        experienceId: exp12.id,
        url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
        publicId: 'pizza_tour',
        order: 1,
        isCover: true,
      },
    }),
    prisma.experiencePhoto.create({
      data: {
        experienceId: exp13.id,
        url: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800',
        publicId: 'harlem',
        order: 1,
        isCover: true,
      },
    }),
    prisma.experiencePhoto.create({
      data: {
        experienceId: exp14.id,
        url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
        publicId: 'perfume',
        order: 1,
        isCover: true,
      },
    }),
    prisma.experiencePhoto.create({
      data: {
        experienceId: exp15.id,
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        publicId: 'literary',
        order: 1,
        isCover: true,
      },
    }),
    prisma.experiencePhoto.create({
      data: {
        experienceId: exp16.id,
        url: 'https://images.unsplash.com/photo-1577720643272-265f4c6f4c5f?w=800',
        publicId: 'met_museum',
        order: 1,
        isCover: true,
      },
    }),
    prisma.experiencePhoto.create({
      data: {
        experienceId: exp17.id,
        url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
        publicId: 'galleries',
        order: 1,
        isCover: true,
      },
    }),
    prisma.experiencePhoto.create({
      data: {
        experienceId: exp18.id,
        url: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800',
        publicId: 'boxing',
        order: 1,
        isCover: true,
      },
    }),
  ]);

  // Create bookings and reviews
  console.log('📅 Creating bookings and reviews...');

  // Create past bookings with reviews
  const pastDate1 = new Date('2026-01-15');
  const pastDate2 = new Date('2026-01-20');
  const pastDate3 = new Date('2026-01-25');

  const booking1 = await prisma.booking.create({
    data: {
      experienceId: exp1.id,
      userId: regularUsers[0].id,
      date: pastDate1,
      guests: 2,
      totalPrice: 90,
      status: 'CONFIRMED',
    },
  });

  await prisma.review.create({
    data: {
      experienceId: exp1.id,
      userId: regularUsers[0].id,
      bookingId: booking1.id,
      rating: 5,
      comment: 'Amazing experience! The waterfalls were breathtaking and Maria was an excellent guide. Highly recommend!',
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      experienceId: exp1.id,
      userId: regularUsers[1].id,
      date: pastDate2,
      guests: 3,
      totalPrice: 135,
      status: 'CONFIRMED',
    },
  });

  await prisma.review.create({
    data: {
      experienceId: exp1.id,
      userId: regularUsers[1].id,
      bookingId: booking2.id,
      rating: 5,
      comment: 'Best tour in Puerto Rico! The natural pools were incredible and transportation was very convenient.',
    },
  });

  const booking3 = await prisma.booking.create({
    data: {
      experienceId: exp2.id,
      userId: regularUsers[2].id,
      date: pastDate3,
      guests: 4,
      totalPrice: 128,
      status: 'CONFIRMED',
    },
  });

  await prisma.review.create({
    data: {
      experienceId: exp2.id,
      userId: regularUsers[2].id,
      bookingId: booking3.id,
      rating: 5,
      comment: 'The waterslide was so much fun! Great for the whole family. Our kids loved it!',
    },
  });

  // Create more reviews for other experiences
  await Promise.all([
    prisma.review.create({
      data: {
        experienceId: exp3.id,
        userId: regularUsers[0].id,
        rating: 5,
        comment: 'Saw three sea turtles! James is a fantastic guide and made everyone feel comfortable.',
      },
    }),
    prisma.review.create({
      data: {
        experienceId: exp4.id,
        userId: regularUsers[1].id,
        rating: 5,
        comment: 'So peaceful and rejuvenating. The sound bath was incredible. Perfect way to start the day!',
      },
    }),
    prisma.review.create({
      data: {
        experienceId: exp5.id,
        userId: regularUsers[2].id,
        rating: 5,
        comment: 'Had so much fun learning salsa! The sunset was gorgeous and the instructor was patient.',
      },
    }),
    prisma.review.create({
      data: {
        experienceId: exp7.id,
        userId: regularUsers[0].id,
        rating: 5,
        comment: 'Perfect introduction to NYC! David showed us everything and shared great local tips.',
      },
    }),
    prisma.review.create({
      data: {
        experienceId: exp8.id,
        userId: regularUsers[1].id,
        rating: 5,
        comment: 'Fascinating cultural experience. Very educational and respectful. The food was delicious!',
      },
    }),
    prisma.review.create({
      data: {
        experienceId: exp9.id,
        userId: regularUsers[2].id,
        rating: 5,
        comment: 'Love Mahjong now! The tea was excellent and I learned so much about Chinese culture.',
      },
    }),
    prisma.review.create({
      data: {
        experienceId: exp10.id,
        userId: regularUsers[0].id,
        rating: 5,
        comment: 'Unbelievable stories from real detectives! Felt like being in a movie. Highly recommend!',
      },
    }),
    prisma.review.create({
      data: {
        experienceId: exp11.id,
        userId: regularUsers[1].id,
        rating: 5,
        comment: 'Created my first street art! The artist was so talented and encouraging. Loved Bushwick!',
      },
    }),
    prisma.review.create({
      data: {
        experienceId: exp12.id,
        userId: regularUsers[2].id,
        rating: 5,
        comment: 'The pizza alone was worth it! So much delicious food and great stories about the Village.',
      },
    }),
    prisma.review.create({
      data: {
        experienceId: exp13.id,
        userId: regularUsers[0].id,
        rating: 5,
        comment: 'Brilliant historian! Learned so much about Harlem\'s incredible cultural impact.',
      },
    }),
    prisma.review.create({
      data: {
        experienceId: exp14.id,
        userId: regularUsers[1].id,
        rating: 5,
        comment: 'My perfume is amazing! Such a unique and fun experience. Great gift idea too!',
      },
    }),
    prisma.review.create({
      data: {
        experienceId: exp15.id,
        userId: regularUsers[2].id,
        rating: 5,
        comment: 'Beautiful tribute to queer writers. Very moving and informative tour.',
      },
    }),
    prisma.review.create({
      data: {
        experienceId: exp16.id,
        userId: regularUsers[0].id,
        rating: 5,
        comment: 'Never thought I could sketch! The Met is incredible and the instruction was excellent.',
      },
    }),
    prisma.review.create({
      data: {
        experienceId: exp18.id,
        userId: regularUsers[1].id,
        rating: 5,
        comment: 'Best workout ever! The champion was inspiring and taught proper form. Challenging but fun!',
      },
    }),
  ]);

  // Create upcoming bookings
  const futureDate1 = new Date('2026-02-20');
  const futureDate2 = new Date('2026-02-25');
  const futureDate3 = new Date('2026-03-01');

  await Promise.all([
    prisma.booking.create({
      data: {
        experienceId: exp3.id,
        userId: regularUsers[0].id,
        date: futureDate1,
        guests: 2,
        totalPrice: 98,
        status: 'CONFIRMED',
      },
    }),
    prisma.booking.create({
      data: {
        experienceId: exp7.id,
        userId: regularUsers[1].id,
        date: futureDate2,
        guests: 1,
        totalPrice: 79,
        status: 'CONFIRMED',
      },
    }),
    prisma.booking.create({
      data: {
        experienceId: exp12.id,
        userId: regularUsers[2].id,
        date: futureDate3,
        guests: 2,
        totalPrice: 158,
        status: 'CONFIRMED',
      },
    }),
  ]);

  console.log('✅ Bookings and reviews created!');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`   Users: ${hosts.length + regularUsers.length + 1}`);
  console.log(`   Experiences: 18`);
  console.log(`   Reviews: 17+`);
  console.log(`   Bookings: 6+`);
  console.log('\n🔐 Test Credentials:');
  console.log('   Admin: admin@airbnb.com / password123');
  console.log('   Host: maria.rodriguez@host.com / password123');
  console.log('   User: user1@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
