# Airbnb Experiences Clone - Frontend Architecture

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # Navigation header with auth menu
│   │   └── Footer.tsx       # Footer with social links
│   ├── ui/
│   │   ├── Button.tsx       # Reusable button component
│   │   ├── Input.tsx        # Form input component
│   │   ├── Card.tsx         # Card container component
│   │   └── TextArea.tsx     # Text area component
│   ├── features/            # Feature-specific components
│   ├── ProtectedRoute.tsx   # Route protection wrapper
│   ├── ExperienceCard.tsx   # Experience listing card
│   └── SearchBar.tsx        # Search and filter form
├── pages/
│   ├── HomePage.tsx              # Landing page
│   ├── LoginPage.tsx             # Authentication
│   ├── SignupPage.tsx            # Registration
│   ├── ExperiencesPage.tsx       # Experience browsing
│   ├── ExperienceDetailPage.tsx  # Experience details & reviews
│   ├── BookingPage.tsx           # Booking flow
│   ├── DashboardPage.tsx         # User dashboard (bookings)
│   └── AdminDashboardPage.tsx    # Admin panel
├── hooks/
│   ├── useRequireAuth.ts    # Authentication guard hook
│   ├── useAsync.ts          # Async operation hook
│   ├── useFilters.ts        # URL filter management
│   ├── useFormState.ts      # Form state management
│   └── index.ts             # Barrel export
├── services/
│   ├── auth.service.ts      # Authentication API calls
│   ├── experience.service.ts # Experience API calls
│   ├── booking.service.ts   # Booking API calls
│   ├── review.service.ts    # Review API calls
│   └── api-client.ts        # Axios instance with interceptors
├── store/
│   └── auth.store.ts        # Zustand auth state
├── types/
│   └── index.ts             # TypeScript interfaces
├── utils/
│   ├── dateUtils.ts         # Date formatting and calculations
│   ├── stringUtils.ts       # String utilities
│   ├── validationUtils.ts   # Validation helpers
│   └── index.ts             # Barrel export
├── lib/
│   └── api-client.ts        # Configured Axios client
├── App.tsx                  # Root component with routing
├── main.tsx                 # React entry point
└── index.css                # Global styles
```

## Component Hierarchy

### Layout
```
App (Router)
├── Header (Navigation)
├── Main (Routes)
│   ├── Public Pages
│   │   ├── HomePage
│   │   ├── ExperiencesPage
│   │   │   └── ExperienceCard (multiple)
│   │   ├── ExperienceDetailPage
│   │   ├── LoginPage
│   │   └── SignupPage
│   ├── Protected Pages
│   │   ├── BookingPage
│   │   ├── DashboardPage
│   │   └── AdminDashboardPage
│   └── ProtectedRoute (wrapper)
└── Footer
```

## State Management

### Zustand Stores
- **auth.store.ts**: User authentication state
  - User information
  - Authentication tokens
  - Login/signup/logout methods
  - Token refresh logic

## API Integration

### Services
- **auth.service.ts**: Login, signup, token refresh, user profile
- **experience.service.ts**: List, search, filter, detail operations
- **booking.service.ts**: Create, cancel, manage bookings
- **review.service.ts**: Create, read, update reviews

### Axios Interceptors
- Request: Adds JWT token to Authorization header
- Response: Handles 401 errors with token refresh retry

## Styling

### Tailwind CSS
- Mobile-first responsive design
- Custom primary color (red/coral)
- Component-level styling with utility classes
- Dark mode support ready

## Form Handling

- **React Hook Form**: Efficient form state management
- **Zod**: Runtime validation and TypeScript-first schema
- **@hookform/resolvers**: Zod integration with React Hook Form

## Routing

- **React Router v6**: Client-side routing
- Protected routes with `ProtectedRoute` component
- Role-based access control (USER, HOST, ADMIN)
- Dynamic route parameters for IDs

## Key Features Implementation

### Authentication
1. JWT tokens stored in localStorage (accessToken, refreshToken)
2. Auto token refresh on 401 responses
3. Protected routes redirect to login
4. User state persisted with Zustand

### Experience Browsing
1. Search by city/location
2. Filter by price range, category, rating
3. Pagination support
4. Experience cards with images, ratings, reviews

### Booking Flow
1. Select date and number of guests
2. Review booking details
3. Submit booking with special requests
4. Cancellation support (48-hour policy)

### User Dashboard
1. View all bookings with status
2. Filter by upcoming/past/cancelled
3. View booking details
4. Cancel bookings
5. Leave reviews for past experiences

### Admin Dashboard
1. Platform statistics
2. User and experience counts
3. Revenue metrics
4. Experience approval workflow
5. Category analytics

## Environment Configuration

### Development (.env.local)
```
VITE_API_URL=http://localhost:5000/api/v1
```

### Production (.env.production)
```
VITE_API_URL=https://api.production.com/api/v1
```

## Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Type Checking
```bash
tsc
```

### Linting
```bash
npm run lint
```

## Best Practices

1. **Component Organization**: One component per file
2. **Naming Conventions**: PascalCase for components, camelCase for utilities
3. **Type Safety**: Full TypeScript coverage
4. **Error Handling**: Try-catch with toast notifications
5. **Loading States**: Spinner/skeleton screens during async operations
6. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
7. **Performance**: Lazy loading, code splitting, memoization where needed

## Testing (Future)

- Unit tests with Vitest
- Component tests with Vitest + React Testing Library
- E2E tests with Cypress
- Coverage target: > 80%

## Common Tasks

### Add a new page
1. Create component in `src/pages/`
2. Add route in `App.tsx`
3. Add navigation link in `Header.tsx`

### Add a new API service
1. Create service in `src/services/`
2. Use apiClient for HTTP requests
3. Export service methods
4. Use in components/hooks

### Add a new hook
1. Create hook in `src/hooks/`
2. Export from `src/hooks/index.ts`
3. Use `use` prefix for hook naming

### Add styling
1. Use Tailwind utility classes first
2. Create global styles in `src/index.css`
3. Component-scoped styles in component files
4. Avoid CSS modules unless necessary
