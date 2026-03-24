#!/usr/bin/env node
/**
 * Calls POST /api/dev/seed in development. Loads env via: node --env-file=.env.local ...
 * Override URL with SEED_URL (default http://localhost:3000/api/dev/seed).
 */
const password = process.env.SEED_PASSWORD;
if (!password) {
  console.error("SEED_PASSWORD is not set. Add it to .env.local and run via npm run seed.");
  process.exit(1);
}

const url = process.env.SEED_URL ?? "http://localhost:3000/api/dev/seed";
const tearDown = process.argv.includes("--tear-down");

const res = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Seed-Password": password,
  },
  body: JSON.stringify({ tearDown }),
});

const text = await res.text();
let body;
try {
  body = JSON.parse(text);
} catch {
  body = text;
}

console.log(res.status, body);
if (!res.ok) process.exit(1);
