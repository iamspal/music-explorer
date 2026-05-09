You are an expert in Vue.js, Vite, Pinia, Tailwind CSS, SCSS, JavaScript, and Docker, with deep understanding of frontend best practices, engineering principles, and production-level code quality standards.

## Project Structure

```
music-explorer/
├── frontend/          # Vue 3 SPA (this is where all frontend work happens)
│   ├── src/
│   │   ├── assets/        # Static assets (images, fonts, global SCSS)
│   │   ├── components/    # Reusable UI components
│   │   ├── composables/   # Vue composables for reusable logic
│   │   ├── router/        # Vue Router route configurations
│   │   ├── stores/        # Pinia store modules
│   │   ├── styles/        # Global styles, variables, mixins
│   │   ├── utils/         # Helper functions and utilities
│   │   └── views/         # Page-level components
├── backend/           # PHP backend (separate service, port 8082)
└── docker-compose.yml
```

Both services run via Docker Compose. The backend is a PHP service at `http://localhost:8082`.

## Tech Stack

- **Vue 3** (Composition API with `<script setup>`)
- **Vite 8** (with HMR, `@` path alias to `./src`)
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin — no PostCSS config needed)
- **SCSS** (Sass, for custom styles, variables, and mixins)
- **Pinia** for state management
- **Vue Router** for routing
- **axios** for HTTP requests
- **Vitest** for unit tests
- **oxlint** + **ESLint** for linting
- **Prettier** for formatting

## Frontend Development Rules

### Code Style and Structure
- Write clean, maintainable, and performant JavaScript code following ES6+ standards
- Use functional and declarative programming patterns; prefer composition over inheritance
- Follow DRY principle and modularize code for reusability
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError, canSubmit)
- All frontend code must be placed inside `frontend/`
- Each file should contain only related content; maximum 300 lines per component
- Use single-file components (SFC) with `<template>`, `<script setup>`, and `<style>` sections in that order

### Naming Conventions
- **Directories**: lowercase with dashes (e.g., `components/auth-wizard`, `utils/date-helpers`)
- **Components**: PascalCase (e.g., `UserProfile.vue`, `DataTable.vue`)
- **Composables**: camelCase with "use" prefix (e.g., `useAuth.js`, `useFormValidation.js`)
- **Stores**: camelCase with "use" prefix and "Store" suffix (e.g., `useUserStore.js`, `useCartStore.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `MAX_RETRY_COUNT`)
- **Functions**: camelCase with descriptive verbs (e.g., `fetchUserData`, `validateFormInput`)
- **CSS classes**: kebab-case following BEM methodology (e.g., `.user-card__title--active`)

### Vue 3 Best Practices
- **Composition API**: Always use Composition API with `<script setup>` syntax
- **Reactivity**: Use `ref` for primitives, `reactive` for objects; avoid unnecessary reactivity
- **Props**: Define props with detailed validation (type, required, default, validator)
- **Emits**: Declare all emitted events with validation when possible
- **Composables**: Extract reusable logic into composables; maintain single responsibility
- **Lifecycle**: Use lifecycle hooks appropriately (onMounted, onUnmounted) for side effects
- **Template**: Keep templates simple; extract complex expressions to computed properties
- **Conditional rendering**: Use `v-if` for conditional mounts, `v-show` for frequent toggles
- **List rendering**: Always use `:key` with unique identifiers, avoid using index as key

### State Management (Pinia)
- Organize stores by feature domain (e.g., `auth`, `products`, `cart`, `ui`)
- Use actions for asynchronous operations and business logic
- Keep getters for derived state; avoid mutating state directly
- Implement proper error handling in actions with try/catch blocks
- Use store composition for cross-store communication
- Reset stores on user logout to prevent data leakage

### Styling (Tailwind CSS v4 + SCSS)
- **Tailwind First**: Use Tailwind utility classes for most styling
- Tailwind v4 is configured via the `@tailwindcss/vite` plugin (no `tailwind.config.js` or `postcss.config.js`)
- Global styles go in `src/assets/main.scss` — import Tailwind with `@import "tailwindcss"`, then add custom SCSS below
- **Custom SCSS**: Use scoped `<style lang="scss">` blocks in SFCs, or `.scss` files in `src/styles/` for shared variables/mixins
- **Design tokens**: Define in `src/styles/_variables.scss` (colors, spacing, typography)
- **Mixins**: Reusable style patterns in `src/styles/_mixins.scss`
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Dark Mode**: Use Tailwind's `dark:` variant with class strategy when needed

### Error Handling
- Use `try/catch` in all async operations with user-friendly error messages
- Log errors to console in development
- Provide meaningful fallback UI for error states
- Validate API responses and handle edge cases gracefully

### API Communication (axios)
- Centralize API calls in `src/api/` modules
- Create an axios instance with a configured base URL (`VITE_API_BASE_URL`)
- Implement request/response interceptors for auth tokens, logging, and error handling
- Use environment variables for API endpoints
- Cancel pending requests when components unmount using AbortController

### Security Best Practices
- **CSRF**: Include CSRF tokens in state-changing requests
- **Authentication**: Store tokens in httpOnly cookies when possible
- **Environment Variables**: Never expose secrets in client-side code; prefix with `VITE_`
- **Dependencies**: Regularly audit dependencies for vulnerabilities
- **Input Validation**: Validate and sanitize all form inputs on client side
- **CORS**: Configure proper CORS headers on the backend server

### Accessibility (a11y)
- Use semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<button>`)
- Include `alt` attributes for all images
- Implement proper focus management and keyboard navigation
- Use ARIA labels where appropriate

### Testing Strategy
- **Unit Tests**: Vitest for utils, composables, and stores
- **Component Tests**: `@vue/test-utils` for component logic
- Aim for 80% test coverage on critical business logic
- Mock external dependencies and API calls

### Development Environment
- **Linting**: oxlint (fast, correctness-focused) and ESLint (Vue 3 recommended + Prettier compatibility)
- **Formatting**: Prettier with the `--experimental-cli` flag
- **Vite**: HMR for fast development; `vite-plugin-vue-devtools` for DevTools integration
- **Environment Config**: Use `.env` files for dev/staging/production (`VITE_` prefixed variables only)

## Docker Commands

The frontend service runs in the `music-explorer-frontend` container. Use `docker compose` (v2) not `docker-compose`.

```bash
# Start services
docker compose up -d

# Install a production dependency
docker compose exec music-explorer-frontend npm install <package-name>

# Install a dev dependency
docker compose exec music-explorer-frontend npm install -D <package-name>

# Run tests
docker compose exec music-explorer-frontend npm run test:unit

# Run linting
docker compose exec music-explorer-frontend npm run lint

# Format code
docker compose exec music-explorer-frontend npm run format

# Rebuild after Dockerfile changes
docker compose up -d --build music-explorer-frontend
```
