# IntellMeet Backend

Production-oriented REST API for **IntellMeet** (authentication, users, meetings, teams, tasks, notifications). Built to match the existing Vite + React frontend in this repo.

## Frontend alignment

| Frontend | Backend |
|----------|---------|
| `VITE_API_URL` default `http://localhost:5000/api` | All routes mounted under `/api` |
| `POST /auth/login`, `POST /auth/signup` | Same paths; `POST /auth/register` is an alias for signup |
| Login/signup response `{ user, token }` | Access JWT in JSON; refresh token in **HTTP-only** cookie `refreshToken` (path `/api/auth`) |
| `withCredentials: true` | CORS `credentials: true` and `CLIENT_URL` origin |
| `Authorization: Bearer <token>` | Required on protected routes |

Meeting list/detail payloads follow `frontend/src/types/index.ts` (`startTime`, `hostId`, `participants`, `actionItems`, etc.).

## Tech stack

Node.js (ESM), Express, MongoDB + Mongoose, JWT access tokens, opaque refresh tokens (hashed in DB), bcrypt, Redis (cache + session + token blacklist), Cloudinary (avatars + attachments), Helmet, express-rate-limit, cookie-parser, cors, multer, express-validator.

## Prerequisites

- Node.js 18+
- MongoDB 6+
- Redis (optional: set `REDIS_DISABLED=true` in `.env` to skip; caching and access-token blacklist are degraded)
- Cloudinary account (optional until you configure uploads)

## Setup

```bash
cd backend
cp .env.example .env
# Edit .env — set MONGODB_URI, JWT_ACCESS_SECRET, and optionally Redis + Cloudinary
npm install
npm run dev
```

API base: `http://localhost:5000/api`  
Health: `GET http://localhost:5000/api/health`

## Environment variables

See `.env.example` for descriptions. **Never commit real secrets**; keep them in `.env` (ignored by git).

## API overview

### Auth (`/api/auth`)

- `POST /register` — same body as signup  
- `POST /signup` — `{ name, email, password }` → `{ user, token }` + refresh cookie  
- `POST /login` — `{ email, password }`  
- `POST /logout` — Bearer required; clears refresh cookie + server session  
- `POST /refresh-token` — uses refresh cookie → new access + refresh  
- `POST /forgot-password` — `{ email }` (in dev, reset URL is logged and may be returned)  
- `POST /reset-password` — `{ email, token, password }`  
- `PUT /change-password` — Bearer + `{ currentPassword, newPassword }`

### Users (`/api/users`, Bearer)

- `GET /profile`  
- `PUT /profile` — `{ name?, bio?, email? }`  
- `POST /avatar` — `multipart/form-data` field `avatar`  
- `GET /all` — **admin only**

### Meetings (`/api/meetings`, Bearer)

- `POST /create` — body includes `title`, `scheduledTime` (ISO), optional `description`, `participantIds`, `status`  
- `GET /` — meetings where user is host or participant (admins see all)  
- `GET /:id` — MongoDB `_id` or `meetingCode`  
- `PUT /:id`, `DELETE /:id` — host or admin  

### Teams (`/api/teams`, Bearer)

Full CRUD: `POST /`, `GET /`, `GET /:id`, `PUT /:id`, `DELETE /:id`.

### Tasks (`/api/tasks`, Bearer)

Full CRUD: `POST /`, `GET /?teamId=`, `GET /:id`, `PUT /:id`, `DELETE /:id`.

### Notifications (`/api/notifications`, Bearer)

- `GET /` — maps `isRead` → `read` in JSON for the UI  
- `PATCH /:id/read`  
- `POST /mark-all-read`

### Upload (`/api/upload`, Bearer)

- `POST /attachment` — field `file`; optional `meetingId` (form field) to append to meeting `attachments`

## Roles

- **admin** — first registered user becomes admin; others default to **member**  
- Admins may list all users and all meetings; members are scoped to their data where applicable  

## Security notes

- Passwords hashed with bcrypt (cost 12)  
- Refresh tokens are never stored in plain text (SHA-256 hash in DB)  
- Access token `jti` can be blacklisted in Redis after logout  
- Helmet + rate limiting + input validation on write routes  

## Scripts

- `npm run dev` — `node --watch src/server.js`  
- `npm start` — `node src/server.js`
