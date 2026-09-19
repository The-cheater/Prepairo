# Prepairo: Environment Configuration & Full-Stack Deployment Guide

This document explains how **Frontend** and **Backend** communicate, where environment files are located, and how to run both locally and in production.

---

## 1. 📁 Where are the `.env` Files?

| Path | Purpose | Why you might not see it by default |
| :--- | :--- | :--- |
| **`backend/.env`** | Configuration for the standalone Express API server (`PORT`, `FRONTEND_URL`, Cloudinary, Supabase, Admin creds) | Files starting with `.` are considered hidden by Windows Explorer and dimmed/hidden by VS Code when gitignored. |
| **`.env.local`** (Root) | Configuration for Next.js (`NEXT_PUBLIC_API_URL`, Supabase, Cloudinary, Admin creds) | In the workspace root directory. |
| **`backend/.env.example`** | Clean template for backend cloud deployment | Visible in `backend/` folder. |
| **`frontend/.env.example`** | Clean template for frontend cloud deployment | Visible in `frontend/` folder. |

> **💡 How to see hidden `.env` files in VS Code:**
> - Press `Ctrl + Shift + P` -> Search **"Preferences: Open User Settings (JSON)"**
> - Ensure `"explorer.excludeGitIgnore": false` (or click the eye icon / toggle hidden files).

---

## 2. 🔄 How Frontend & Backend Communicate

1. **Direct API Communication (`getApiUrl`)**:
   - Every frontend component (`UploadForm`, `BrowsePapers`, `AdminDashboard`, `UserDashboard`, `RequestBoard`, `StatTiles`, `HeroSection`, `CommandSearch`) calls endpoints via `getApiUrl('/api/...')` from `frontend/lib/api.ts`.
   - In **Local Development**: `NEXT_PUBLIC_API_URL` is set to `http://localhost:5000/api`. The browser sends requests directly to the Express backend on port 5000.
   - In **Production Deployment**: `NEXT_PUBLIC_API_URL` is set to your cloud backend (e.g. `https://prepairo-backend.onrender.com/api`).
   - If `NEXT_PUBLIC_API_URL` is left empty or set to `/api`, Next.js rewrites in `next.config.ts` automatically forward `/api/*` requests to the backend server.

2. **CORS (Cross-Origin Resource Sharing)**:
   - In `backend/server.ts`, CORS is dynamically configured to allow `FRONTEND_URL` (`http://localhost:3000` locally, or your deployed frontend domain in production).
   - In development, all local origins (`localhost:3000`, `127.0.0.1:3000`, etc.) are permitted automatically.

---

## 3. 💻 Local Development Setup

To run both servers locally:

### Terminal 1: Backend Server (Port 5000)
```bash
cd backend
npm install
npm start
# Server starts at http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### Terminal 2: Frontend Server (Port 3000)
```bash
# From the project root:
npm run dev
# App starts at http://localhost:3000
```

Now, when you interact with the app at `http://localhost:3000` (uploading a paper, browsing, approving/rejecting in `/admin`, redeeming credits), you will see live request logs in Terminal 1:
```
[2026-09-19T...] GET /api/papers 200 in 2ms
[2026-09-19T...] POST /api/upload 200 in 120ms
[2026-09-19T...] PATCH /api/papers/paper-123 200 in 15ms
```

---

## 4. 🚀 Production Deployment Settings

### A. Deploying the Backend (e.g., Render, Railway, Fly.io, Heroku)

1. Connect your repository to your cloud host.
2. Set the **Root Directory** to `backend`.
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm start`
5. **Environment Variables**:
   ```env
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://prepairo.vercel.app

   CLOUDINARY_CLOUD_NAME=kskx0jpz
   CLOUDINARY_API_KEY=922275931553238
   CLOUDINARY_API_SECRET=5yyyi1A-nXdLFdvje97JiK12lq4
   CLOUDINARY_URL=cloudinary://922275931553238:5yyyi1A-nXdLFdvje97JiK12lq4@kskx0jpz

   NEXT_PUBLIC_SUPABASE_URL=https://lefonaaqbxhqzxczjlnw.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_qZ_NQmtw0EHHrZEs-o1Fgg_Mk2sYGhh

   ADMIN_USERNAME=rohanjena
   ADMIN_PASSWORD=1234554321
   ```

### B. Deploying the Frontend (e.g., Vercel, Netlify)

1. Connect your repository to Vercel.
2. Set the **Root Directory** to `./` (root).
3. **Environment Variables**:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-service.onrender.com/api
   FRONTEND_URL=https://prepairo.vercel.app

   NEXT_PUBLIC_SUPABASE_URL=https://lefonaaqbxhqzxczjlnw.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_qZ_NQmtw0EHHrZEs-o1Fgg_Mk2sYGhh
   NEXT_PUBLIC_MAX_FILE_SIZE=2097152

   ADMIN_USERNAME=rohanjena
   ADMIN_PASSWORD=1234554321
   ```

---

## 5. 🧪 Verification & Health Check

Test that your backend is alive and communicating:
```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get

# cURL
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "Prepairo Backend API",
  "environment": "development",
  "port": 5000
}
```
