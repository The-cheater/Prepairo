# Prepairo Backend API Server

This is the standalone Express backend for **Prepairo** (IISER Thiruvananthapuram Previous Year Question Paper Platform).

## 📁 Environment Configuration

The environment file is located at `backend/.env`.
*(Note: If you cannot see it in VS Code or Windows File Explorer, ensure "Show Hidden Files" is enabled, as files starting with `.` may be hidden or dimmed by `.gitignore` rules.)*

### Environment Variables

| Variable | Description | Local Value | Deployment Value |
| :--- | :--- | :--- | :--- |
| `PORT` | Port the Express server listens on | `5000` | Provided by cloud host (Render/Railway/Fly) or `5000` |
| `NODE_ENV` | Environment mode | `development` | `production` |
| `FRONTEND_URL` | Allowed origin for CORS | `http://localhost:3000` | `https://your-frontend.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | Configured in `.env` | Configured in `.env` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | Configured in `.env` | Configured in `.env` |
| `CLOUDINARY_API_SECRET` | Cloudinary Secret | Configured in `.env` | Configured in `.env` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Configured in `.env` | Configured in `.env` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | Configured in `.env` | Configured in `.env` |
| `ADMIN_USERNAME` | Admin portal username | `rohanjena` | `rohanjena` |
| `ADMIN_PASSWORD` | Admin portal password | `1234554321` | `1234554321` |

## 🚀 Running Locally

```bash
# From the backend directory:
cd backend
npm install
npm start
# or for hot reloading:
npm run dev
```

Server runs on: **http://localhost:5000**
Health Check: **http://localhost:5000/api/health**

## 🌐 Production Deployment (e.g. Render, Railway, Fly.io)

1. Set the **Root Directory** to `backend` (or build command `npm install && npm run build` and start command `npm start`).
2. Add the environment variables listed above in your cloud host's dashboard.
3. Make sure `FRONTEND_URL` is set to your deployed frontend domain (e.g., `https://prepairo.vercel.app`).
4. In your frontend host (e.g. Vercel), set `NEXT_PUBLIC_API_URL` to `https://your-backend-api.onrender.com/api`.
