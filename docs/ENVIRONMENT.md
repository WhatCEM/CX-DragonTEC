# DtechCX Front - Environment Configuration

This project uses environment variables for configuration across different environments.

## Environment Files

| File | Purpose |
|------|---------|
| `.env.example` | Template with all available variables (committed to git) |
| `.env.development` | Development environment defaults |
| `.env.staging` | Staging/preview environment defaults |
| `.env.production` | Production environment defaults |
| `.env.local` | Local overrides (not committed to git) |

## Variable Naming Convention

All client-side environment variables must be prefixed with `VITE_` to be exposed to the application.

## Usage in Code

```typescript
// Access environment variables
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;

// Check environment mode
if (import.meta.env.DEV) {
  // Development only code
}

if (import.meta.env.PROD) {
  // Production only code
}
```

## Available Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APP_NAME` | Application display name | `DtechCX` |
| `VITE_APP_VERSION` | Current app version | `0.1.0` |
| `VITE_API_URL` | Base API endpoint | `https://api.example.com` |
| `VITE_API_TIMEOUT` | API request timeout (ms) | `30000` |
| `VITE_FEATURE_ANALYTICS` | Enable analytics | `true` / `false` |
| `VITE_FEATURE_DEBUG_MODE` | Show debug info | `true` / `false` |

## Security Notes

- Never commit `.env.local` or files containing actual secrets
- Use CI/CD secrets for production values
- The `.env.example` file should only contain placeholder/example values
