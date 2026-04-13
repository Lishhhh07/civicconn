# Civic Issue Reporting Backend

Production-ready Express + MongoDB backend for the React + Vite civic reporting frontend.

## Folder Structure

```text
backend/
|-- config/
|-- controllers/
|-- middleware/
|-- models/
|-- routes/
|-- utils/
|-- .env.example
|-- app.js
|-- package.json
|-- server.js
```

## Setup

1. Install backend dependencies:
   - `cd backend`
   - `npm install`
2. Create `.env` from `.env.example`.
3. Start backend:
   - Development: `npm run dev`
   - Production: `npm start`

## API Endpoints

### Auth

- `POST /api/auth/register` (multipart/form-data; optional `avatar`)
- `POST /api/auth/login`

### Issues

- `POST /api/issues` (protected, multipart/form-data; `images[]`)
- `GET /api/issues`
- `GET /api/issues/:id`
- `GET /api/issues/user/me` (protected)
- `GET /api/issues/nearby?lat=..&lng=..&radius=..`
- `PATCH /api/issues/:id/status` (protected admin)

### Notifications

- `GET /api/notifications` (protected)
- `PATCH /api/notifications/:id/read` (protected)

## Notes

- Status update endpoint creates an in-app notification for issue owner.
- `ADMIN_EMAIL` controls admin access for issue status updates.
- Responses use a consistent format:
  - `{ success, message, data }`
