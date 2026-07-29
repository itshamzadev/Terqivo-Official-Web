# Coolify deployment (Port 3000)

Use these settings:

- Build command: `npm run build`
- Start command: `npm start`
- Port Exposes: `3000`
- Health check path: `/api/health`

Required environment variables:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=<your Coolify MongoDB connection string>
JWT_SECRET=<strong random secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://terqivo.com,https://www.terqivo.com
COOKIE_NAME=terqivo_admin_token
ADMIN_NAME=Super Admin
ADMIN_EMAIL=admin@terqivo.com
ADMIN_PASSWORD=<strong password>
VITE_API_URL=/api
VITE_SITE_URL=https://terqivo.com
```

The application binds to `0.0.0.0:3000`, which is suitable for Coolify/Docker.
