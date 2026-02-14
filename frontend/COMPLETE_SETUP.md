# 🚀 Airbnb Experiences Clone - Frontend Complete Setup

This is a **production-ready** React + Vite + TypeScript frontend for an Airbnb Experiences clone application. All components are fully built and configured for immediate development and deployment.

## ✨ What's Included

### Pages (8 Total)
- ✅ **HomePage** - Landing page with hero section, features, categories, CTA
- ✅ **ExperiencesPage** - Browse & search experiences with advanced filtering
- ✅ **ExperienceDetailPage** - Full experience details with reviews and booking CTA
- ✅ **BookingPage** - Complete booking flow with date/guest selection
- ✅ **DashboardPage** - User bookings management with filtering and cancellation
- ✅ **LoginPage** - Authentication with email/password and validation
- ✅ **SignupPage** - User registration with role selection
- ✅ **AdminDashboardPage** - Admin analytics and platform statistics

### Components (20+ Total)
#### Layout & Navigation
- ✅ Header - Sticky navigation with auth menu and mobile support
- ✅ Footer - Social links and company information

#### UI Components
- ✅ Button - Variants (primary, secondary, outline, ghost), sizes, loading state
- ✅ Input - Text input with label and error support
- ✅ Card - Container with header, content, and footer
- ✅ TextArea - Multi-line text input with validation

#### Feature Components
- ✅ ExperienceCard - Experience listing card with image, rating, details
- ✅ SearchBar - Advanced search and filter form
- ✅ ProtectedRoute - Role-based access control

### Architecture Features
- ✅ **Authentication System** - JWT tokens, auto-refresh on 401, localStorage persistence
- ✅ **API Service Layer** - Axios with interceptors, error handling
- ✅ **State Management** - Zustand for global auth state
- ✅ **Form Validation** - React Hook Form + Zod schema validation
- ✅ **Type Safety** - Full TypeScript coverage with comprehensive interfaces
- ✅ **Utilities** - Date formatting, string manipulation, validation helpers
- ✅ **Custom Hooks** - useRequireAuth, useAsync, useFilters, useForm
- ✅ **Responsive Design** - Mobile-first Tailwind CSS

### Configuration & DevOps
- ✅ **Vite** - Next-gen build tool with HMR, optimized production builds
- ✅ **Tailwind CSS** - Utility-first CSS with custom primary colors
- ✅ **ESLint** - Code quality checking with TypeScript and React rules
- ✅ **Prettier** - Automatic code formatting
- ✅ **Environment Variables** - .env.local for development, .env.production for prod
- ✅ **TypeScript Config** - Strict type checking enabled
- ✅ **PostCSS** - CSS processing with Autoprefixer

### Documentation (5 Files)
- 📖 **README.md** - Project overview and quick start
- 📖 **SETUP.md** - Detailed setup and deployment guide
- 📖 **ARCHITECTURE.md** - Project structure and component hierarchy
- 📖 **CONTRIBUTING.md** - Code style and contribution guidelines
- 📖 **PRODUCTION_CHECKLIST.md** - Pre-deployment verification

## 🎯 Quick Start

### Prerequisites
```bash
# Verify Node.js version
node --version  # Should be 20+
npm --version   # Should be 10+
```

### Installation (2 minutes)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5000/api/v1" > .env.local

# Start development server
npm run dev
```

Visit `http://localhost:5173` 🎉

## 📦 Available Scripts

```bash
npm run dev              # Start dev server with hot reload
npm run build           # Production build → dist/
npm run type-check      # Check TypeScript errors
npm run lint            # Check code quality
npm run lint:fix        # Auto-fix linting issues
npm run format          # Format code with Prettier
npm run preview         # Preview production build
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── layout/         # Header, Footer
│   │   ├── ui/             # Reusable UI components
│   │   ├── ExperienceCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ExperiencesPage.tsx
│   │   ├── ExperienceDetailPage.tsx
│   │   ├── BookingPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── AdminDashboardPage.tsx
│   ├── services/           # API calls
│   │   ├── auth.service.ts
│   │   ├── experience.service.ts
│   │   ├── booking.service.ts
│   │   └── review.service.ts
│   ├── store/              # Zustand state
│   │   └── auth.store.ts
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript interfaces
│   ├── config/             # Configuration
│   ├── lib/                # External libraries setup
│   ├── App.tsx             # Main app component with routing
│   └── main.tsx            # React entry point
├── .env.local              # Local development settings
├── .env.production         # Production settings
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── eslint.config.js        # ESLint configuration
├── .prettierrc              # Prettier configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## 🔐 Authentication Flow

1. **Register** - User creates account with email/password
2. **Login** - Receives JWT (accessToken + refreshToken)
3. **Persistent** - Tokens stored in localStorage
4. **Auto-Refresh** - Interceptor handles 401 with token refresh
5. **Protected Routes** - Role-based access control
6. **Logout** - Tokens cleared, redirect to login

## 🎨 Key Features

### Experience Browsing
- Search by city/location
- Filter by price range, category
- Pagination support
- High-quality image gallery
- Ratings and reviews display

### Booking System
- Date and guest selection
- Real-time price calculation
- Special requests support
- 48-hour cancellation policy
- Booking confirmation

### User Dashboard
- View all bookings with status filters
- Cancel upcoming bookings
- Leave reviews for past experiences
- Booking details and history

### Admin Panel
- Platform statistics
- User and experience metrics
- Revenue analytics
- Experience approval workflow

## 🚀 Development Workflow

### Creating a New Page
```tsx
// 1. Create component in src/pages/
export function NewPage() {
  return <div>New Page</div>;
}

// 2. Add route in src/App.tsx
<Route path="/new" element={<NewPage />} />

// 3. Add navigation link in Header.tsx
<Link to="/new">New Page</Link>
```

### Adding an API Service
```tsx
// 1. Create service in src/services/
export const newService = {
  async getData() {
    return apiClient.get('/endpoint');
  }
};

// 2. Use in components
const response = await newService.getData();
```

## 🧪 Testing Recommendations

- **Unit Tests**: Vitest + React Testing Library
- **E2E Tests**: Cypress or Playwright
- **Visual Testing**: Percy or Chromatic
- **Performance**: Lighthouse CI

## 📱 Responsive Design

Built with mobile-first approach:
- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)
- ✅ Large Desktop (1440px+)

## 🛡️ Security

- JWT token management with auto-refresh
- Environment variables for API configuration
- Input validation with Zod schemas
- Protected routes with role-based access
- CORS configured on backend
- No credentials in version control

## 📊 Performance

- Code splitting via Vite
- Lazy loading routes
- CSS minification
- JavaScript minification
- Image optimization ready
- Tree-shaking of unused code

## 🌐 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS 12+, Android)

## 📡 API Integration

Backend API expected at: `http://localhost:5000/api/v1`

### Endpoints Used
- POST `/auth/login` - Authenticate user
- POST `/auth/signup` - Register new user
- POST `/auth/refresh` - Refresh token
- GET `/experiences` - List experiences
- GET `/experiences/{id}` - Get experience details
- POST `/bookings` - Create booking
- GET `/bookings/my` - Get user bookings
- GET `/reviews/experience/{id}` - Get reviews

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub and connect to Vercel
# Auto-deploys on push to main
# Environment: Set VITE_API_URL in Vercel dashboard
```

### Docker
```bash
npm run build
docker build -t airbnb-frontend .
docker run -p 3000:3000 airbnb-frontend
```

### Traditional Server
```bash
npm run build
# Copy dist/ to web server
# Configure server for SPA (serve index.html for all routes)
```

## ❓ FAQ

**Q: How do I add a new page?**
A: Create component in `src/pages/`, add route in `App.tsx`, add navigation link.

**Q: How do I manage environment variables?**
A: Create `.env.local` for development, `.env.production` for production builds.

**Q: How do I handle API errors?**
A: API client automatically shows toast notifications. Catch errors in components for additional handling.

**Q: How do I add authentication to a new page?**
A: Wrap page in `<ProtectedRoute>` component to require login.

**Q: How do I style components?**
A: Use Tailwind CSS utility classes. Avoid CSS-in-JS unless necessary.

## 📞 Support

- Check [SETUP.md](./SETUP.md) for detailed setup guide
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for project structure
- Check [CONTRIBUTING.md](./CONTRIBUTING.md) for code guidelines
- Check [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) before deployment

## 📝 License

This project is part of an educational Airbnb Experiences clone. All rights reserved.

---

**Created**: February 2026  
**Status**: ✅ Production Ready  
**Last Updated**: February 2026
