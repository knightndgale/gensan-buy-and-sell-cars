import { randomUUID } from "node:crypto";
import { getAdminStorage } from "@/lib/firebase/admin";

const ALLOWED_MIMETYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 64);
}

export async function uploadListingImage(
  listingId: string,
  file: Buffer,
  mimetype: string,
  originalName: string
): Promise<string> {
  if (!ALLOWED_MIMETYPES.includes(mimetype)) {
    throw new Error(`Invalid image type: ${mimetype}`);
  }

  const storage = getAdminStorage();
  const bucket = storage.bucket();
  if (!bucket) throw new Error("Firebase Storage bucket not configured");

  const ext = getExtensionFromMimetype(mimetype);
  const sanitized = sanitizeFilename(originalName) || "image";
  const filename = `${randomUUID()}-${sanitized}${ext}`;
  const path = `listings/${listingId}/${filename}`;

  const fileRef = bucket.file(path);
  await fileRef.save(file, {
    metadata: { contentType: mimetype },
  });

  const bucketName = bucket.name;
  const encodedPath = encodeURIComponent(path);
  const storageEmulatorHost = process.env.FIREBASE_STORAGE_EMULATOR_HOST;
  if (storageEmulatorHost) {
    return `http://${storageEmulatorHost}/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
  }
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
}

function getExtensionFromMimetype(mimetype: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };
  return map[mimetype] ?? ".jpg";
}
