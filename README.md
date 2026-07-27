# Desk — Vercel Prototype

Client-facing UI prototype for the Desk Channel Partner Management Platform.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push the extracted project files to a GitHub repository.
2. Import that repository into Vercel.
3. Keep the Framework Preset set to **Next.js**.
4. Keep the root directory as the directory containing `package.json`.
5. Deploy.

Optional environment variable:

```env
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

This package intentionally excludes the original OpenAI hosting, Vinext, Cloudflare Worker/D1, example, and test-template files. It uses mock data and is intended only as a prototype preview, not the final production Phase 1 platform.
