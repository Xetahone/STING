# Sting — Prototype (Sting Ultra)

Overview
- Full-stack prototype: backend (Node/TypeScript/Express) + mobile (Expo React Native).
- Key features scaffolded: OTP signup/login flows, voice-only comments with enforced durations per tier, media upload flow, story/post, Socket.IO signaling for realtime chat/calls, FFmpeg worker for validation/transcode.
- Theme: darker yellow + black. Paid plan name: "Sting Ultra".

Quickstart (local, dev)
1. Copy files into a repo with the same structure.
2. Create .env files for backend and mobile using provided .env.example.
3. Start services:
   - `docker compose up -d` (Postgres, Redis, MinIO)
   - `cd backend && npm install && npm run dev`
   - `cd mobile && npm install && expo start`
4. For OTP/SMS/email and S3, configure provider credentials in backend .env.

Notes
- Bee sound placeholders are in mobile/assets/sounds/*. Replace with real .opus/.aac files.
- FFmpeg is required on the host (workers use ffmpeg/ffprobe).
- This scaffold focuses on architecture and key checks (e.g., duration validation), not production hardening.

Sting Ultra (paid)
- Free: voice comment max 15s, video post max 5m.
- Sting Ultra: voice comment 16s–5m, video posts >10m allowed (configurable).

Files included below. Use them as base to extend functionality.