# TERQIVO Platform

A production-ready technology company platform built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features
- **Public Website:** Professional, responsive landing pages for services, products, courses, jobs, and a company blog.
- **Dynamic Content:** Pages are backed by MongoDB, including dynamic rendering for terms, privacy policy, and leadership profiles.
- **Forms & Workflows:** Fully functional contact forms, job applications, and course enrollment forms with Zod validation.
- **Admin Panel:** Secure dashboard with full CRUD capabilities for managing services, products, courses, jobs, applications, messages, and blog posts.
- **Authentication:** Secure JWT-based authentication with HTTP-only cookies.

## Tech Stack
- **Frontend:** React, Vite, React Router, Tailwind CSS, React Hook Form, Zod, Framer Motion, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **Build System:** Vite (frontend), ESBuild (backend)

## aaPanel Deployment Guide

This project is configured to run on an Ubuntu VPS managed via aaPanel.

### Target Structure
```text
/www/wwwroot/terqivo/
├── package.json
├── server.ts
├── src/           (Frontend source)
├── server/        (Backend source)
├── dist/          (Built frontend/backend assets)
└── README.md
```

### 1. VPS & aaPanel Setup
1. Install **Node.js** (LTS version, e.g., 20.x) through the aaPanel App Store (Node.js Version Manager).
2. Install **Nginx** through aaPanel.
3. Add your domain (`terqivo.com` and `www.terqivo.com`) pointing to the VPS IP via an A Record in your DNS (e.g., Cloudflare).

### 2. Project Installation
1. SSH into your VPS and navigate to your website root:
   ```bash
   cd /www/wwwroot/terqivo
   ```
2. Clone your GitHub repository (or upload the files):
   ```bash
   git clone https://github.com/your-username/terqivo-platform.git .
   ```
3. Install all dependencies:
   ```bash
   npm run install:all
   ```

### 3. Environment Configuration
1. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your production details:
   ```env
   NODE_ENV=production
   PORT=4000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0...
   JWT_SECRET=your_secure_random_string
   CLIENT_URL=https://terqivo.com
   COOKIE_NAME=terqivo_admin_token
   VITE_API_URL=/api
   VITE_SITE_URL=https://terqivo.com
   ```
*(Note: Do not expose MongoDB on the VPS locally, use MongoDB Atlas with your VPS IP allowlisted.)*

### 4. Build and Seed
1. Build the production React frontend and backend:
   ```bash
   npm run build
   ```
   *(This creates the static frontend and the `dist/server.cjs` backend executable.)*
2. Seed the initial Super Admin:
   ```bash
   npm run seed:admin
   ```

### 5. Node Application Configuration in aaPanel
1. In aaPanel, go to **Website -> Node Project -> Add Node Project**.
2. **Project Directory**: `/www/wwwroot/terqivo`
3. **Startup File**: `/www/wwwroot/terqivo/dist/server.cjs`
4. **Project Name**: `terqivo_api`
5. **Port**: `4000`
6. **Node Version**: Select the installed LTS version.
7. Click **Submit** to start the backend.

### 6. Nginx & SSL Configuration
1. In aaPanel, go to **Website -> PHP Project -> Add Site** (or add via HTML project).
2. **Domain**: `terqivo.com` and `www.terqivo.com`
3. **Document Root**: `/www/wwwroot/terqivo/dist`
4. Go to the site's **SSL** tab, select **Let's Encrypt** (or configure Cloudflare Origin cert), and enable **Force HTTPS**.
5. Go to the site's **Config** tab and replace the Nginx configuration with the provided template in `deployment/nginx-terqivo.conf`.

---

## Deployment Checklist

**Before Deployment:**
- [ ] Git repository pushed with NO secrets, `.env` files, or `node_modules`
- [ ] MongoDB Atlas cluster created, database user created
- [ ] VPS IP allowlisted in MongoDB Atlas Network Access
- [ ] Domain DNS configured (A record to VPS IP)

**During Deployment:**
- [ ] Repository cloned to `/www/wwwroot/terqivo`
- [ ] Dependencies installed via `npm run install:all`
- [ ] `.env` file created with valid production secrets
- [ ] Build generated successfully via `npm run build`
- [ ] Backend started successfully on port `4000` via aaPanel Node Project Manager
- [ ] Nginx configured with React Router fallback and proxy to `127.0.0.1:4000`
- [ ] SSL enabled and forced (HTTPS)
- [ ] Super Admin seeded via `npm run seed:admin`

**After Deployment:**
- [ ] Home page (`https://terqivo.com`) loads securely
- [ ] Direct route refresh (e.g., `/about`) works without 404
- [ ] API Health Endpoint (`https://terqivo.com/api/health`) returns `{ success: true, message: "TERQIVO API is running", environment: "production" }`
- [ ] Admin login (`/admin/login`) works and session persists
- [ ] Public forms (Contact, Enroll, Job App) submit correctly
- [ ] MongoDB updates properly
- [ ] Mobile responsive layout confirmed
- [ ] Browser console has no breaking errors

## Media Handling Limitations
Currently, image uploads and CVs rely on URL inputs. For a scalable production environment, this should be integrated with object storage solutions like Amazon S3, Cloudinary, or Cloudflare R2 in future updates.

## Local Development
```bash
npm run install:all
npm run dev
```
