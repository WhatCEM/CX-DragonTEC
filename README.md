# DtechCX Front

A modern, scalable React application built with Vite and TypeScript.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **pnpm** - Fast, disk-efficient package manager

## Requirements

- Node.js >= 22.0.0
- pnpm >= 9.0.0

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Access at http://localhost:5173
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm dev:host` | Start dev server accessible on network |
| `pnpm build` | Build for production |
| `pnpm build:staging` | Build for staging environment |
| `pnpm build:production` | Build for production environment |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint issues |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm clean` | Remove dist and node_modules |

## Docker

### Development with Docker

```bash
# Start development server with hot reload
pnpm docker:dev

# Or directly with docker compose
docker compose up dev
```

### Production Build

```bash
# Build and run production-like preview
pnpm docker:preview

# Build production image
pnpm docker:build

# Run production container
docker run -p 8080:80 dtechcx-front
```

## Vercel Deployment

The project is configured for Vercel deployment:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

## Environment Variables

See [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) for detailed documentation.

### Quick Setup

1. Copy `.env.example` to `.env.local`
2. Fill in your values
3. Restart the dev server

### Available Variables

| Variable | Description |
|----------|-------------|
| `VITE_APP_NAME` | Application name |
| `VITE_APP_VERSION` | App version |
| `VITE_API_URL` | Backend API URL |
| `VITE_API_TIMEOUT` | API request timeout |
| `VITE_FEATURE_ANALYTICS` | Enable analytics |
| `VITE_FEATURE_DEBUG_MODE` | Show debug info |

## Project Structure

```
src/
├── layouts/          # Layout components
│   └── RootLayout.tsx
├── pages/            # Page components
│   ├── Dashboard.tsx
│   ├── About.tsx
│   ├── Settings.tsx
│   └── NotFound.tsx
├── router/           # React Router configuration
│   └── index.tsx
├── styles/           # CSS styles
│   ├── layout.css
│   └── pages.css
├── main.tsx          # Application entry point
└── vite-env.d.ts     # TypeScript declarations
```

## Team Setup

### Node Version Management

The project includes `.nvmrc` and `.node-version` files. Use nvm or similar tools:

```bash
# Using nvm
nvm use

# Using fnm
fnm use
```

### IDE Setup

Recommended VS Code extensions are in `.vscode/extensions.json`. Install them for the best development experience.

## License

Private - All rights reserved
