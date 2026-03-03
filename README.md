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
