# DarkML Frontend - React Application

A responsive, secure, and interactive React.js frontend application for the DarkML educational platform, supporting multiple user roles (Admin, Teacher, Student, Parent).

## Features

- **Role-Based Access Control**: Secure routing with role-based guards
- **Authentication**: JWT-based authentication with API integration
- **Responsive Design**: Modern, mobile-friendly UI
- **API-Driven**: All actions are API-driven with no business logic in frontend
- **TypeScript**: Full type safety throughout the application
- **Charts & Tables**: Reusable components for data visualization

## Tech Stack

- **React 18** with TypeScript
- **React Router 6** for client-side routing
- **Axios** for API calls
- **Recharts** for data visualization
- **Vite** for build tooling

## Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/        # React contexts (Auth)
├── pages/           # Page components
│   ├── dashboards/  # Role-specific dashboards
│   └── ...
├── services/        # API service layer
├── types/           # TypeScript type definitions
└── App.tsx          # Main application component
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your API base URL:
```
VITE_API_BASE_URL=http://3.226.252.253:8000
```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build the application:
```bash
npm run build
```

The production build will be in the `dist/` directory.

## Deployment to AWS

### S3 + CloudFront Setup

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Create S3 bucket:**
   - Create a bucket for static website hosting
   - Enable static website hosting
   - Set index document to `index.html`

3. **Upload files:**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

4. **Configure CloudFront:**
   - Create a CloudFront distribution
   - Set S3 bucket as origin
   - Set default root object to `index.html`
   - Configure error pages (404 → `/index.html` for SPA routing)

5. **Route 53:**
   - Create an alias record pointing to your CloudFront distribution

6. **AWS WAF (Optional):**
   - Attach WAF to CloudFront for Layer 7 security

## API Integration

The application is configured to work with the backend API at:
- **API Base URL**: `http://3.226.252.253:8000`
- **API Documentation**: `http://3.226.252.253:8000/redoc/`
- **Admin Panel**: `http://3.226.252.253:8000/admin/`

All API calls are handled through the `apiService` in `src/services/api.ts`.

## User Roles

- **Admin**: Full system access
- **Teacher**: Manage classes and assignments
- **Student**: View classes and submit assignments
- **Parent**: Monitor children's progress

## Route Guards

Protected routes use the `ProtectedRoute` component which:
- Checks authentication status
- Validates user roles
- Redirects unauthorized users

## Environment Variables

- `VITE_API_BASE_URL`: Backend API base URL
- `VITE_ENV`: Environment (development/production)

## License

Private - DarkML Educational Platform

