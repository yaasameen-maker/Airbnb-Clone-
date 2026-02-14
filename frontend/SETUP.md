# Frontend Setup Guide

## Quick Start

### 1. Prerequisites
- Node.js 20+ (check with `node --version`)
- npm 10+ (or yarn/pnpm)
- Backend API running at `http://localhost:5000`

### 2. Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file (copy template)
cp .env.example .env.local

# Edit .env.local if needed (default localhost should work)
echo "VITE_API_URL=http://localhost:5000/api/v1" > .env.local
```

### 3. Development Server

```bash
# Start development server
npm run dev

# Server will be running at http://localhost:5173
# Page auto-reloads on file changes
```

### 4. Build for Production

```bash
# Type check
npm run type-check

# Build (creates optimized dist/)
npm run build

# Preview built version
npm run preview

# Deploy the dist/ folder to your hosting service
```

## Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run type-check` | Check TypeScript errors (no emit) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting without changes |

## Configuration

### Environment Variables

```env
# .env.local (development)
VITE_API_URL=http://localhost:5000/api/v1

# .env.production (production build)
VITE_API_URL=https://api.production.com/api/v1
```

### TypeScript

- **Main config**: `tsconfig.json`
- **App config**: `tsconfig.app.json`
- **Build tool config**: `tsconfig.node.json`

### Tailwind CSS

- **Config**: `tailwind.config.js`
- **Colors**: Primary color uses red palette (#dc2626 for 600)
- **Utilities**: All Tailwind utilities available

### ESLint

- **Config**: `eslint.config.js`
- **Includes**: React best practices, hooks, TypeScript

### Prettier

- **Config**: `.prettierrc`
- **Ignore**: `.prettierignore`
- **Format Check**: Run `npm run format:check` before committing

## Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed structure and component hierarchy.

## Development Workflow

### Adding a New Page

1. Create component in `src/pages/PageName.tsx`
2. Define route in `src/App.tsx`
3. Add navigation link in `src/components/layout/Header.tsx`
4. Use TypeScript for type safety
5. Follow existing patterns for UI

### Adding an API Service

1. Create service in `src/services/service.ts`
2. Use the pre-configured `apiClient` instance
3. Define request/response types from `src/types/index.ts`
4. Export service methods
5. Use in components through hooks/direct service calls

### Creating a Custom Hook

1. Create hook in `src/hooks/hookName.ts`
2. Export from `src/hooks/index.ts`
3. Use `use` prefix in hook name
4. Return object/array with state and handlers
5. Document hook usage

### Styling Components

1. Use Tailwind utility classes primarily
2. Add component-level CSS in component files if needed
3. Add global styles in `src/index.css`
4. Use custom classes from `index.css` (button, input, card)
5. Follow mobile-first responsive design

## Testing Locally

### Login Test User

To test the application without a real backend:
1. Use mock username/password (adjust as needed for your backend)
2. Token will be stored in localStorage
3. Authenticated routes will be accessible

### API Testing

Use the included Axios client which handles:
- Authorization headers
- Token refresh on 401
- Error handling
- Base URL configuration from .env

## Common Issues & Solutions

### Port Already in Use

```bash
# Kill process on port 5173
npm run dev -- --port 5174  # Use different port
```

### TypeScript Errors

```bash
# Check and fix
npm run type-check
npm run lint:fix
```

### Import Errors

- Ensure relative paths are correct
- Check barrel exports in `index.ts` files
- Verify TypeScript import types

### Styling Not Applied

- Check if Tailwind CSS is imported in `src/index.css`
- Ensure classes are in `content` array in `tailwind.config.js`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### API Connection Issues

- Verify backend is running on `localhost:5000`
- Check `.env.local` has correct `VITE_API_URL`
- Check browser console for CORS errors
- Verify backend CORS configuration

## Deployment

### Vercel / Netlify

```bash
# These platforms auto-detect Vite
# Just connect your GitHub repo
# Build command: npm run build
# Output directory: dist
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Traditional Server

1. Run `npm run build`
2. Copy `dist/` to your web server
3. Configure server to serve `index.html` for all routes (SPA)
4. Set environment variables for production API URL

## Performance Optimization

- Code splitting via Vite (automatic)
- Tree shaking of unused imports
- CSS minification in production
- Image optimization (use modern formats)
- Lazy load routes with React.lazy() (when needed)

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Security

- HTTPS in production (critical for authentication)
- CORS properly configured on backend
- JWT tokens secure in localStorage (httpOnly not possible in SPA)
- Environment secrets never in version control
- Content Security Policy headers recommended

## Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Support & Troubleshooting

For issues:
1. Check the browser console for errors
2. Check production build logs
3. Verify all dependencies are installed
4. Check environment variables are set correctly
5. Review commit history for recent changes
