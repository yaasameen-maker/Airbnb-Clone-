# Contributing Guidelines

## Code Style

### JavaScript/TypeScript
- Use PascalCase for React components
- Use camelCase for variables, functions, and file names
- Use UPPER_SNAKE_CASE for constants and enums
- Maximum line length: 100 characters (enforced by Prettier)

### File Organization
- One component per file (unless closely related)
- Organize imports: React → third-party → local
- Export components as named exports (except pages)

### TypeScript
- Always use TypeScript for new files
- Define interfaces/types at the top of files
- Avoid using `any` type
- Use strict type checking

## Git Workflow

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `refactor/improvement` - Code refactoring
- `docs/description` - Documentation

### Commit Messages
```
feat: Add new experience card component
fix: Resolve token refresh issue on 401
docs: Update API documentation
refactor: Simplify form validation logic
style: Format code with prettier
test: Add unit tests for auth service
```

### Pull Request Process
1. Create feature branch from `main`
2. Make changes with clear commits
3. Run tests and linting: `npm run lint:fix && npm run type-check`
4. Create PR with description of changes
5. Request review from team members
6. Address feedback before merging
7. Merge to `main`

## Code Review Guidelines

### What to Look For
- ✅ Code follows TypeScript best practices
- ✅ Components are reusable and well-organized
- ✅ Performance considerations (no unnecessary re-renders)
- ✅ Error handling and edge cases
- ✅ Tests are included
- ✅ Documentation is clear
- ✅ No console.logs or debugging code left behind

### Testing Checklist
- [ ] Feature works on desktop
- [ ] Feature works on mobile
- [ ] Error states are handled
- [ ] Loading states are shown
- [ ] No console errors
- [ ] Accessibility is considered

## Component Creation Checklist

```tsx
// ✅ DO
import { useState } from 'react';
import type { ComponentProps } from 'react';
import { Button } from './ui/Button';

interface MyComponentProps {
  title: string;
  onSubmit: (data: string) => void;
  isLoading?: boolean;
}

export function MyComponent({ title, onSubmit, isLoading }: MyComponentProps) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    onSubmit(input);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Button onClick={handleSubmit} isLoading={isLoading}>
        Submit
      </Button>
    </div>
  );
}
```

```tsx
// ❌ DON'T
export function myComponent(props: any) {
  // Don't use PascalCase for non-components
  // Don't use `any` type
  // Don't have inline styles
  return <div style={{ color: 'red' }}>Test</div>;
}
```

## Pre-commit Checklist

Before pushing your changes:

```bash
# 1. Format code
npm run format

# 2. Run linter
npm run lint:fix

# 3. Type check
npm run type-check

# 4. Review changes
git diff

# 5. Commit and push
git push origin feature/your-feature
```

## Documentation

### Code Comments
```tsx
// ✅ Good: Explains WHY, not WHAT
// Retry the request if token expired
if (error.response?.status === 401) {
  // ...
}

// ❌ Poor: States the obvious
// Set isLoading to true
setIsLoading(true);
```

### JSDoc Comments
```tsx
/**
 * Formats a date string into a readable format
 * @param date - ISO date string or Date object
 * @param format - Format template (default: 'short')
 * @returns Formatted date string
 * @example
 * formatDate('2026-02-14', 'long')
 * // Returns: 'Saturday, February 14, 2026'
 */
export function formatDate(date: string | Date, format = 'short'): string {
  // ...
}
```

## Performance Guidelines

### DO
- ✅ Memoize expensive computations
- ✅ Lazy load routes/components
- ✅ Use keys in list renders
- ✅ Minimize re-renders with useCallback
- ✅ Optimize images

### DON'T
- ❌ Inline function definitions in JSX
- ❌ Create objects/arrays in render
- ❌ Use `index` as React key
- ❌ Store entire API responses and filter in render
- ❌ Render all data (use pagination/virtualization)

## Accessibility

- Use semantic HTML (`button`, `nav`, `main`, etc.)
- Include `alt` text for images
- Use proper heading hierarchy
- Ensure sufficient color contrast
- Support keyboard navigation
- Include ARIA labels where needed

## Security

- Never commit secrets (API keys, tokens)
- Use environment variables for configuration
- Validate user input on client AND server
- Don't store sensitive data in localStorage
- Keep dependencies updated
- Use HTTPS in production

## Testing

### Test File Organization
```
src/
├── __tests__/
│   ├── unit/
│   │   └── utils.test.ts
│   ├── components/
│   │   └── Button.test.tsx
│   └── integration/
│       └── auth-flow.test.tsx
```

### Test Naming
```typescript
// Use descriptive test names
describe('Button Component', () => {
  it('should call onClick handler when clicked', () => {
    // ...
  });

  it('should disable button when isLoading is true', () => {
    // ...
  });
});
```

## Questions & Discussions

- Use GitHub Discussions for feature ideas
- Use Issues for bug reports
- Use PRs for code changes
- Keep discussions respectful and constructive

## Code of Conduct

- Be respectful to other developers
- Provide constructive feedback
- Help newer team members
- Report issues professionally
- Celebrate contributions

---

Thank you for contributing! Your improvements make this project better for everyone. 🎉
