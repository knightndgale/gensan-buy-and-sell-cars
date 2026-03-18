# Postman Collection

API collection for Gensan Car Buy & Sell.

## Setup

1. **Import into Postman**
   - Open Postman
   - File → Import → Select `Gensan-Car-Buy-And-Sell.postman_collection.json`
   - Optionally import `Local.postman_environment.json` and select it

2. **Start the dev server**
   ```bash
   npm run dev
   ```

3. **Set variables** (Collection or Environment)
   - `baseUrl`: `http://localhost:3000` (default)
   - `idToken`: Firebase ID token (for Create Session)
   - `seedPassword`: Value of `SEED_PASSWORD` from `.env.local` (for Seed Data)

## Auth Flow

1. **Get Firebase ID token**
   - Sign in via the web app at `/seller/login` or `/admin/login`
   - In browser DevTools → Application → Cookies, copy the `session` cookie value
   - Or use Firebase Auth REST API to sign in and get `idToken`

2. **Create session**
   - Run **Auth → Create Session (Login)** with `idToken` in the body
   - The collection script stores the session cookie for subsequent requests
   - Protected endpoints use `Authorization: Bearer {{sessionToken}}` (set from cookie)

3. **Use protected endpoints**
   - All requests in Seller, Listings, etc. inherit Bearer auth from the collection
   - Ensure `sessionToken` is set (auto-populated after Create Session)

## Endpoints

| Folder | Endpoints |
|--------|-----------|
| **Auth** | Create Session, Delete Session, Get Current User |
| **Seller** | Create Seller (dev only), Get Seller Profile |
| **Cars** | Get Makes, Get Models, Browse Listings |
| **Features** | Get Features, Add Feature |
| **Listings** | Create, Update, Get Images, Set Primary Image, Delete Image |
| **GHL Analytics** | Get GHL Analytics |
| **Dev** | Seed Data (dev only) |

## Dev-Only Endpoints

- `POST /api/seller` – Create seller (requires `NODE_ENV=development`)
- `POST /api/dev/seed` – Seed or tear down data (requires `SEED_PASSWORD`)
