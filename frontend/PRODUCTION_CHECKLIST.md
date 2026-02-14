# Production Deployment Checklist

## Pre-Deployment

### Code Quality
- [ ] Run `npm run lint:fix` and resolve any remaining issues
- [ ] Run `npm run type-check` and fix TypeScript errors
- [ ] Run `npm run format` to ensure consistent code style
- [ ] Review all console.log statements and remove/replace with proper logging
- [ ] Check for TODO/FIXME comments that should be resolved
- [ ] Remove debug code and development-only features

### Testing
- [ ] Test all pages in development mode
- [ ] Test on mobile devices (iOS and Android)
- [ ] Test with slow network (DevTools throttling)
- [ ] Test all authentication flows (login, signup, logout, token refresh)
- [ ] Test all API calls and error handling
- [ ] Test form validation and error messages
- [ ] Test responsive design at breakpoints: 320px, 768px, 1024px, 1440px
- [ ] Test keyboard navigation and accessibility

### Dependencies
- [ ] Run `npm audit` and fix security vulnerabilities
- [ ] Update all outdated dependencies: `npm update`
- [ ] Check for and remove unused dependencies
- [ ] Verify all required dependencies are listed
- [ ] Lock dependency versions in package-lock.json

### Configuration
- [ ] Verify API URL is correct for production environment
- [ ] Create `.env.production` with production values
- [ ] Ensure all environment variables are securely managed
- [ ] Check CORS settings with backend
- [ ] Verify SSL/HTTPS configuration
- [ ] Test with production-like database

### Performance
- [ ] Run Lighthouse audit and aim for > 90 on all metrics
- [ ] Check build size: `npm run build` and review output
- [ ] Optimize images (use WebP format where possible)
- [ ] Verify lazy loading is configured for routes
- [ ] Check for duplicate dependencies
- [ ] Test with browser DevTools Network tab on throttled connection

### Security
- [ ] Verify no secrets committed to repository
- [ ] Check `.env.local` and `.env.production` are in `.gitignore`
- [ ] Audit third-party dependencies for known vulnerabilities
- [ ] Test CORS headers are restrictive
- [ ] Verify authentication tokens are handled securely
- [ ] Check for XSS vulnerabilities
- [ ] Verify CSRF protection if needed
- [ ] Review Content Security Policy headers

## Build & Deployment

### Build
- [ ] Run `npm run build` successfully without errors
- [ ] Verify `dist/` folder contains all necessary files
- [ ] Check `dist/index.html` exists and is valid
- [ ] Verify all assets are in `dist/`
- [ ] Test source maps are disabled in production build

### Server Configuration
- [ ] Configure server to serve `dist/index.html` for all routes (SPA handling)
- [ ] Set proper cache headers:
  - HTML: `Cache-Control: max-age=0, must-revalidate`
  - JS/CSS: `Cache-Control: max-age=31536000, immutable`
  - Images: `Cache-Control: max-age=86400`
- [ ] Enable GZIP compression
- [ ] Configure HTTPS and HTTP → HTTPS redirect
- [ ] Set security headers:
  ```
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  ```

### Deployment
- [ ] Set up CI/CD pipeline
- [ ] Configure environment variables in hosting platform
- [ ] Set `.env.production` values in platform
- [ ] Deploy to staging environment first
- [ ] Test all functionality in staging
- [ ] Deploy to production
- [ ] Monitor error logs for first hour
- [ ] Test critical user paths in production

## Post-Deployment

### Monitoring
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Set up analytics (Google Analytics, Mixpanel, etc.)
- [ ] Monitor API response times
- [ ] Track JavaScript errors
- [ ] Monitor backend logs for API issues
- [ ] Check email alerts for critical errors

### Performance
- [ ] Monitor Lighthouse scores
- [ ] Track Core Web Vitals
- [ ] Monitor page load times
- [ ] Check CDN performance
- [ ] Monitor database query times

### User Experience
- [ ] Gather user feedback
- [ ] Monitor user flows
- [ ] Check for unusual error patterns
- [ ] Monitor 404 errors for missing routes
- [ ] Check browser compatibility issues

### Documentation
- [ ] Update deployment documentation
- [ ] Document environment variables needed
- [ ] Document rollback procedures
- [ ] Update team with deployment status
- [ ] Create incident report if issues occur

## Rollback Plan

If issues occur in production:
1. [ ] Identify the issue (error logs, monitoring)
2. [ ] Notify the team
3. [ ] Deploy previous stable version
4. [ ] Investigate issue in non-production environment
5. [ ] Create fix and test thoroughly
6. [ ] Re-deploy to production
7. [ ] Document incident and resolution

## Post-Rollback

- [ ] Review what went wrong
- [ ] Create ticket for the issue
- [ ] Add additional testing to prevent recurrence
- [ ] Update documentation if needed
- [ ] Share lessons learned with team

## Performance Optimization Checklist

- [ ] Implement lazy loading for routes
- [ ] Optimize bundle size (check with `npm run build`)
- [ ] Minimize API requests (use caching where appropriate)
- [ ] Use CSS-in-JS optimizations
- [ ] Enable HTTP/2 Server Push for critical assets
- [ ] Implement service worker for offline support (if needed)
- [ ] Minify CSS and JavaScript
- [ ] Remove unused CSS with PurgeCSS/Tailwind

## Browser Compatibility

Test in:
- [ ] Chrome (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Edge (latest 2 versions)
- [ ] Mobile Safari (iOS 12+)
- [ ] Chrome Mobile (Android)

## Accessibility Compliance

- [ ] WCAG 2.1 Level AA compliance
- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Keyboard-only navigation
- [ ] Color contrast ratios > 4.5:1 for text
- [ ] Alt text for all images
- [ ] Proper heading hierarchy
- [ ] Form labels associated with inputs
- [ ] Error messages are descriptive

## Final Verification

- [ ] Test login/signup flow end-to-end
- [ ] Test booking creation end-to-end
- [ ] Test user dashboard functionality
- [ ] Test admin panel (if applicable)
- [ ] Verify API integration is working
- [ ] Check email notifications (if applicable)
- [ ] Verify payment integration (if applicable)
- [ ] Test file uploads (if applicable)

## Deployment Sign-Off

- [ ] QA: _________________________ Date: _______
- [ ] DevOps: _____________________ Date: _______
- [ ] Product Owner: _____________ Date: _______

---

## Emergency Contacts

- Project Lead: [Contact Info]
- DevOps Lead: [Contact Info]
- On-Call Support: [Contact Info]
