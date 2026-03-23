#!/usr/bin/env node
/**
 * Creates composite indexes via the Firestore REST API (alternative to
 * `firebase deploy --only firestore:indexes`).
 *
 * Prerequisites:
 *   export GOOGLE_ACCESS_TOKEN="$(gcloud auth print-access-token)"
 *   export GOOGLE_CLOUD_PROJECT=gensanbuyandsellcars   # optional if gcloud default is set
 *
 * Idempotent: duplicate index errors are ignored (HTTP 409 or ALREADY_EXISTS in body).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT || "gensanbuyandsellcars";
const token = process.env.GOOGLE_ACCESS_TOKEN;
const databaseId = process.env.FIRESTORE_DATABASE_ID || "(default)";
const collectionGroup = "listings";
const delayMs = Number(process.env.INDEX_POST_DELAY_MS ?? 150);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  if (!token) {
    console.error('Missing GOOGLE_ACCESS_TOKEN. Run: export GOOGLE_ACCESS_TOKEN="$(gcloud auth print-access-token)"');
    process.exit(1);
  }

  const path = join(ROOT, "firestore.indexes.json");
  const doc = JSON.parse(readFileSync(path, "utf8"));
  const indexes = doc.indexes ?? [];
  const base = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${encodeURIComponent(databaseId)}/collectionGroups/${collectionGroup}/indexes`;

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < indexes.length; i++) {
    const entry = indexes[i];
    const body = {
      queryScope: entry.queryScope || "COLLECTION",
      fields: entry.fields,
    };

    const res = await fetch(base, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    if (res.ok) {
      created++;
      console.log(`[${i + 1}/${indexes.length}] OK`);
    } else {
      const dup = res.status === 409 || text.includes("ALREADY_EXISTS") || text.includes("already exists") || text.includes("Index already exists");
      if (dup) {
        skipped++;
        console.log(`[${i + 1}/${indexes.length}] skip (exists)`);
      } else {
        failed++;
        console.error(`[${i + 1}/${indexes.length}] ${res.status} ${text.slice(0, 500)}`);
      }
    }

    if (i < indexes.length - 1) await sleep(delayMs);
  }

  console.log(`Done: created=${created}, skipped_duplicates=${skipped}, failed=${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
