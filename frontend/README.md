# Airbnb Experiences Clone - Frontend

A modern, responsive frontend application for Airbnb Experiences built with React, TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **Authentication System**: Complete login/signup flow with JWT token management
- **Experience Browsing**: Search, filter, and explore experiences by category
- **Booking System**: Book experiences with date selection
- **User Dashboard**: Manage bookings, profile, and reviews
- **Host Features**: Create and manage experiences (for hosts)
- **Admin Panel**: Platform management and analytics (for admins)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: Zustand for global state
- **Form Validation**: Zod schema validation with React Hook Form
- **API Integration**: Axios with interceptors for token refresh

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **date-fns** - Date utilities

## 🔧 Setup Instructions

### Prerequisites

- Node.js 20+
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   
   For local development (`.env.local`):
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```
   
   For production (`.env.production`):
   ```env
   VITE_API_URL=https://airbnb-clone-production-b895.up.railway.app/api/v1
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173/`

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🔐 Authentication Flow

The app uses JWT-based authentication with automatic token refresh:

1. User logs in → Receives access token and refresh token
2. Tokens stored in localStorage and Zustand store
3. Access token included in all API requests via Axios interceptor
4. On 401 error → Automatically attempts to refresh token
5. On refresh failure → User redirected to login page

## 📱 Pages

### Public Pages
- **Home** (`/`) - Landing page with CTAs
- **Experiences** (`/experiences`) - Browse and search experiences
- **Login** (`/login`) - User login
- **Signup** (`/signup`) - User registration

### Protected Pages (Require Authentication)
- **Bookings** (`/bookings`) - User's bookings
- **Profile** (`/profile`) - User profile settings

## 🔌 API Integration

All API calls go through the centralized `api-client.ts` with:
- Automatic token injection
- Token refresh on 401 errors
- Error handling with toast notifications
- TypeScript types for all requests/responses

## 🤝 Integration with Backend

This frontend connects to the backend API at:
- **Local**: `http://localhost:5000/api/v1`
- **Production**: `https://airbnb-clone-production-b895.up.railway.app/api/v1`

Ensure the backend is running and accessible before starting the frontend.

---

**Happy coding! 🎉**
