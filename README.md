# School Connect — Frontend

Next.js 14 app for the School Connect partner and admin portal.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` in `.env.local` to your backend API (e.g. `http://localhost:5000/api/v1`).

## Deploy on Vercel

### 1. Import the repository

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import [School-Connect-frontend](https://github.com/Abhir-1905-ram/School-Connect-frontend).
3. **Root Directory:** leave as `.` (repo root).
4. **Framework Preset:** Next.js (auto-detected).
5. **Build Command:** `npm run build`
6. **Output Directory:** (default, leave empty)

### 2. Environment variables

In **Project → Settings → Environment Variables**, add:

| Name | Value | Environments |
|------|--------|--------------|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-BACKEND-URL/api/v1` | Production, Preview, Development |

Use your deployed backend URL (Railway, Render, etc.). Must be **HTTPS** in production.

Example:

```
NEXT_PUBLIC_API_URL=https://school-connect-api.onrender.com/api/v1
```

### 3. Deploy

Click **Deploy**. Vercel will build and host the app at `https://your-project.vercel.app`.

### 4. Connect the backend (required)

Your API must allow the Vercel origin. On the **backend**, set:

```env
CLIENT_URL=https://your-project.vercel.app
```

Redeploy the backend after changing `CLIENT_URL`. Without this, login and API calls will fail with CORS errors.

### 5. Optional — custom domain

In Vercel: **Project → Settings → Domains** → add your domain, then update backend `CLIENT_URL` to match.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | ESLint |
