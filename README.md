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

Fill in your Firebase and GHL credentials. 3. **Firebase setup**

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

## Local development with Firebase emulators

The project supports two development paths:

| Path               | Who                                        | Credentials required                                         |
| ------------------ | ------------------------------------------ | ------------------------------------------------------------ |
| **Real Firebase**  | Seniors / you                              | `FIREBASE_ADMIN_PRIVATE_KEY`, `FIREBASE_ADMIN_CLIENT_EMAIL`  |
| **Emulators only** | Interns / devs without access to prod keys | None (uses a dummy credential; emulators do not validate it) |

This lets interns run the app locally without ever receiving sensitive Firebase Admin credentials.

### Emulator setup (no credentials)

1. **Install Firebase CLI** (if needed)

```bash
 npm install -g firebase-tools
```

2. **Configure `.env.local`**

- Copy from `.env.example` and fill in the public Firebase config (`NEXT_PUBLIC_*`) from Firebase Console.
- Add these emulator variables (do **not** add `FIREBASE_ADMIN_*`):

```bash
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
FIRESTORE_EMULATOR_HOST=localhost:8080
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199
```

> **Important:** `FIREBASE_AUTH_EMULATOR_HOST` must be `host:port` only (e.g. `localhost:9099`). Do **not** include `http://`—the SDK adds the protocol. Using `http://localhost:9099` causes `getaddrinfo ENOTFOUND http`. 3. **Start the emulators**

```bash
npx firebase emulators:start --only auth,firestore,storage
```

Or use `npm run emulator` if it runs the same. 4. **Start the app** (in a separate terminal)

```bash
 npm run dev
```

5. **Optional: seed data**
   The dev seed API (`POST /api/dev/seed`) works with emulators. Requires `SEED_PASSWORD` in `.env.local`:

### Emulator ports

| Emulator    | Port | Purpose                                                     |
| ----------- | ---- | ----------------------------------------------------------- |
| Auth        | 9099 | Firebase Authentication                                     |
| Firestore   | 8080 | Firestore database                                          |
| Storage     | 9199 | Cloud Storage (listing images)                              |
| Emulator UI | 4000 | View data at [http://127.0.0.1:4000](http://127.0.0.1:4000) |

### With real Firebase (seniors)

Omit the emulator variables and set `FIREBASE_ADMIN_PRIVATE_KEY` and `FIREBASE_ADMIN_CLIENT_EMAIL` in `.env.local`. The app connects to production Firebase.

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
- FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199

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
  test
