# Gensan Car Buy & Sell

A Next.js 15 car marketplace for General Santos with Firebase backend, GHL integration, and seller dashboard.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: shadcn/ui (Radix primitives)
- **Backend**: Firebase (Auth, Firestore, Storage)
- **CRM**: GoHighLevel (GHL) for forms and analytics

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Firebase and GHL credentials.

3. **Firebase setup**
   - Create a Firebase project
   - Enable Auth (email/password)
   - Create Firestore database
   - Enable Storage
   - Add web app and copy config to `.env.local`
   - Generate service account key for Admin SDK

4. **Firestore collections**
   - `users`
   - `dealers`
   - `carMakes` (reference data)
   - `carModels` (reference data)
   - `listings`
   - `listingImages`

5. **Run development server**
   ```bash
   npm run dev
   ```

## Build

```bash
npm run build
```

Build succeeds without Firebase credentials (returns empty data). Add credentials for production.

## Routes

- `/` - Home (featured listings, hero, trust links)
- `/cars` - All listings with filters
- `/cars/[id]` - Listing detail + GHL form
- `/seller/login` - Seller login
- `/seller` - Seller dashboard
- `/seller/listings` - Manage listings
- `/seller/listings/new` - Add listing
- `/seller/listings/[id]/edit` - Edit listing

## Environment example

### Firebase (client - safe to expose)

- NEXT_PUBLIC_FIREBASE_API_KEY=
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
- NEXT_PUBLIC_FIREBASE_PROJECT_ID=
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
- NEXT_PUBLIC_FIREBASE_APP_ID=

### For firebase emulator

- NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
- FIRESTORE_EMULATOR_HOST=localhost:8080
- FIREBASE_AUTH_EMULATOR_HOST=localhost:9099

### Firebase Admin (server-only - never expose)

- FIREBASE_ADMIN_PRIVATE_KEY=
- FIREBASE_ADMIN_CLIENT_EMAIL=

### GHL (server-only)

- GHL_API_TOKEN=
- GHL_DEFAULT_LOCATION_ID=

### GHL Form (client - fallback when dealer has no ghlFormEmbedUrl)

- NEXT_PUBLIC_GHL_FORM_EMBED_URL=

### Dev seeder (only used when NODE_ENV=development)

- SEED_PASSWORD=
