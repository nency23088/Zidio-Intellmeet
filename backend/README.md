# IntellMeet Backend

Production-oriented API for **IntellMeet** with realtime meeting rooms, Socket.io/WebRTC signaling, Redis-backed presence, and AI meeting intelligence (transcription, summaries, action items, and notifications).

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

Node.js (ESM), Express, MongoDB + Mongoose, Socket.io, Redis adapter, OpenAI Whisper/GPT, Hugging Face inference, JWT access tokens, opaque refresh tokens (hashed in DB), bcrypt, Redis (cache + session + token blacklist), Cloudinary (avatars + attachments), Helmet, express-rate-limit, cookie-parser, cors, multer, express-validator.

## Realtime scope

- Meeting room join/leave and presence tracking
- Participant updates, typing indicators, chat, and notifications
- WebRTC signaling for offer/answer/ICE exchange
- Screen-share and media-state signaling
- Redis room cache and socket session storage
- AI progress events back to the active meeting room

## Prerequisites

- Node.js 18+
- MongoDB 6+
- Redis (optional: set `REDIS_DISABLED=true` in `.env` to skip; caching and access-token blacklist are degraded)
- OpenAI API key for Whisper/GPT meeting analysis
- Hugging Face API key for sentiment and inference
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

Key realtime and AI variables:

- `CLIENT_URL` - comma-separated frontend origins for CORS and Socket.io
- `REDIS_URL` - Redis connection string for cache, sessions, and socket adapter
- `REDIS_DISABLED` - set to `true` to run without Redis
- `OPENAI_API_KEY` - Whisper transcription and GPT summarization
- `HUGGINGFACE_API_KEY` - sentiment and inference fallback
- `PORT` - HTTP + Socket.io port, default `5000`

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

Realtime `notification` socket events are also emitted to `user:{userId}` rooms when AI analysis completes or when the app sends a live notification.

### Socket.io

The Socket.io server is created in `src/socket/index.js` and attached in `src/server.js`.

Supported event families include:

- Meeting presence: `join-room`, `leave-room`, `user-joined`, `user-left`
- Chat: `send-message`, `receive-message`, `typing`, `stop-typing`
- WebRTC: `offer`, `answer`, `ice-candidate`, `screen-share-start`, `screen-share-stop`, `media-state-change`
- Collaboration: cursor/document/whiteboard events in `src/socket/handlers/collaboration.handler.js`
- Notifications: `notification`
- AI progress: `ai-progress`, `ai-summary-ready`

Rooms are namespaced as `meeting:{meetingId}` and `user:{userId}`.

## AI workflow

`POST /api/ai/transcribe/:meetingId` runs the full pipeline:

1. Whisper transcription
2. Speaker attribution across transcript segments
3. GPT summary generation
4. GPT action item extraction
5. MongoDB persistence for transcript, summary, action items, and meeting rollup fields
6. Realtime progress events to the meeting room and a notification to the meeting host

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
