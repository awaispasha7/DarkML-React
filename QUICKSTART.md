# Quick Start Guide

Get the DarkML React frontend up and running in minutes.

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

1. Copy the environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and set your API base URL:
```
VITE_API_BASE_URL=http://3.226.252.253:8000
```

## Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Endpoint Configuration

**Important:** Check your API documentation at `http://3.226.252.253:8000/redoc/` to verify the authentication endpoint.

If your API uses a different login endpoint (e.g., `/auth/login` instead of `/auth/token`), update `src/services/api.ts`:

```typescript
// Change this line in src/services/api.ts
const response = await this.api.post<AuthResponse>('/auth/token', formData, {
  // to match your API endpoint, e.g.:
  // const response = await this.api.post<AuthResponse>('/auth/login', formData, {
```

## Testing Login

1. Navigate to `/login`
2. Enter credentials for one of your user roles (Admin, Teacher, Student, or Parent)
3. You'll be redirected to the appropriate dashboard based on your role

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory, ready for deployment to S3/CloudFront.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

