import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create categories
  const categories = [
    {
      name: 'Arts & Culture',
      slug: 'arts-culture',
      description: 'Explore local art, history, and cultural traditions',
      icon: '🎨',
      order: 1,
    },
    {
      name: 'Entertainment',
      slug: 'entertainment',
      description: 'Concerts, shows, and entertainment experiences',
      icon: '🎭',
      order: 2,
    },
    {
      name: 'Food & Drink',
      slug: 'food-drink',
      description: 'Culinary adventures and tasting experiences',
      icon: '🍽️',
      order: 3,
    },
    {
      name: 'Sports',
      slug: 'sports',
      description: 'Active adventures and athletic activities',
      icon: '⚽',
      order: 4,
    },
    {
      name: 'Wellness',
      slug: 'wellness',
      description: 'Yoga, meditation, and wellness activities',
      icon: '🧘',
      order: 5,
    },
    {
      name: 'Nature & Outdoors',
      slug: 'nature-outdoors',
      description: 'Outdoor adventures and nature exploration',
      icon: '🏔️',
      order: 6,
    },
    {
      name: 'Sightseeing',
      slug: 'sightseeing',
      description: 'Tours and guided sightseeing experiences',
      icon: '🗺️',
      order: 7,
    },
    {
      name: 'Social Impact',
      slug: 'social-impact',
      description: 'Give back while experiencing something unique',
      icon: '💚',
      order: 8,
    },
    {
      name: 'Animals',
      slug: 'animals',
      description: 'Animal encounters and wildlife experiences',
      icon: '🐾',
      order: 9,
    },
    {
      name: 'Classes & Workshops',
      slug: 'classes-workshops',
      description: 'Learn new skills from expert instructors',
      icon: '📚',
      order: 10,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log(`✅ Created ${categories.length} categories`);

  // Create demo admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@airbnb-experiences.com' },
    update: {},
    create: {
      email: 'admin@airbnb-experiences.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      emailVerified: true,
      phoneVerified: true,
      isActive: true,
    },
  });

  console.log(`✅ Created admin user: ${adminUser.email}`);

  // Create demo host user
  const hostPassword = await bcrypt.hash('Host123!', 10);

  const hostUser = await prisma.user.upsert({
    where: { email: 'host@airbnb-experiences.com' },
    update: {},
    create: {
      email: 'host@airbnb-experiences.com',
      password: hostPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'HOST',
      emailVerified: true,
      phoneVerified: true,
      isActive: true,
      bio: 'Professional photographer and tour guide with 10+ years of experience showing visitors the best of San Francisco.',
      hometown: 'San Francisco, CA',
      languages: ['English', 'Spanish'],
      interests: ['Photography', 'Travel', 'Food'],
    },
  });

  console.log(`✅ Created demo host: ${hostUser.email}`);

  // Create demo guest user
  const guestPassword = await bcrypt.hash('Guest123!', 10);

  const guestUser = await prisma.user.upsert({
    where: { email: 'guest@airbnb-experiences.com' },
    update: {},
    create: {
      email: 'guest@airbnb-experiences.com',
      password: guestPassword,
      firstName: 'John',
      lastName: 'Smith',
      role: 'GUEST',
      emailVerified: true,
      phoneVerified: true,
      isActive: true,
      bio: 'Travel enthusiast exploring the world one experience at a time.',
      hometown: 'New York, NY',
      languages: ['English'],
      interests: ['Travel', 'Photography', 'Food', 'History'],
    },
  });

  console.log(`✅ Created demo guest: ${guestUser.email}`);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
