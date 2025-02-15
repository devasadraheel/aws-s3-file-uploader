# AWS S3 File Uploader Demo

A clean demo app showcasing practical AWS S3 integration with pre-signed URLs.

## Features

- Upload & download files via pre-signed URLs
- Simple Next.js UI with progress bar
- NestJS API for signing URLs + basic metadata
- Drag-and-drop file upload
- File validation (size, mime type)
- Real-time upload progress

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm/npm
- AWS S3 bucket with proper CORS and IAM permissions
- Environment variables configured (see below)

### Environment Setup

Create `.env` files in both `backend/` and `frontend/` directories:

**backend/.env:**
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
PORT=3001
```

**frontend/.env.local:**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### S3 CORS Configuration

Configure your S3 bucket CORS policy:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### IAM Permissions

Your AWS user/role needs these S3 permissions:
- `s3:PutObject`
- `s3:GetObject`
- `s3:HeadObject`

### Run Commands

**Quick Start (Both apps):**
```bash
# Install all dependencies
npm run install:all

# Start both backend and frontend in development mode
npm run dev
```

**Individual Commands:**

**Backend (NestJS):**
```bash
cd backend
npm install
npm run start:dev
```

**Frontend (Next.js):**
```bash
cd frontend
npm install
npm run dev
```

**Other Commands:**
```bash
# Build both apps
npm run backend:build
npm run frontend:build

# Run tests
npm run backend:test
npm run frontend:test

# Run e2e tests
npm run backend:test:e2e

# Lint and format
npm run lint
npm run format
```

Visit `http://localhost:3000` to use the app.

## Project Structure

```
├── backend/          # NestJS API
├── frontend/         # Next.js App
└── README.md
```

## Known Limits

- No server-side file storage (purely presigned demo)
- Files are stored directly in S3
- No authentication/authorization (demo purposes)
- Local state only (no database)

## Development

This project uses:
- **Backend**: NestJS, TypeScript, AWS SDK v3
- **Frontend**: Next.js (App Router), React, Axios
- **Tooling**: ESLint, Prettier
- **Package Manager**: pnpm (or npm)
