<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/fb037f02-ed65-4192-80a7-668d80c3a903

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Production data persistence

Admin-managed courses, services, products, blog posts, jobs, settings, users, and submissions are stored in MongoDB. Uploaded images, course payment screenshots, job resumes, and job payment screenshots are stored in MongoDB GridFS by default (`UPLOAD_STORAGE=gridfs`). This keeps them available after a new build or redeploy.

Before deploying, configure the same persistent MongoDB connection string on every deployment:

- `MONGODB_URI` — a persistent MongoDB/Atlas database
- `UPLOAD_STORAGE=gridfs`
- `GRIDFS_BUCKET=terqivoUploads` (optional; keep the default unless you need a different bucket)

Do not rely on the container's `public/uploads` folder for production data. It is only a local fallback. The `/api/health` endpoint reports a non-2xx response when production cannot connect to MongoDB, preventing the app from silently running with non-persistent content.
