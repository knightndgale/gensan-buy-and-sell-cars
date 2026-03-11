import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let _adminApp: ReturnType<typeof initializeApp> | null = null;

/** Dummy credential for emulator-only use (emulators do not validate it). Do not use in production. */
const EMULATOR_DUMMY_PRIVATE_KEY =
  "-----BEGIN PRIVATE KEY-----\n" +
  "MIIBVgIBADANBgkqhkiG9w0BAQEFAASCAUAwggE8AgEAAkEAvtYHonBkTyFRuA4T\n" +
  "ChO7CKPPyk4n/RaFcxU3ocxefhhvrVOaB3TencSk2M5zsgeV+qs09DVafXgXg/HK\n" +
  "6i0Z7QIDAQABAkANBN76dv5w444Gp3cnDdeJrFtFqvVRb9Lk2gK0mBOuOHBLpe30\n" +
  "rmuw247TZModUdlt8G/rQyMOu1yhy9XrAdrhAiEA7966Ltl1ReJDvzb3LYjjf9aH\n" +
  "J1qzzKn60EIl4k+1v0UCIQDLqzN3DemWmRPIFwM4EarUIouVYBK9331QlLyFyQem\n" +
  "iQIhALfNKUlA5DXafSMGUT0ZCYoproKfY+rNzRzLsw/JGHEpAiEAi+SJEhJtSrLU\n" +
  "YpBj9qQz+UfNJon59Y9HzQyMvTwK1DkCIQDH20riilBtDSplYhyoMzsCpnO3+LpN\n" +
  "+V02TbdIMpuuVA==\n" +
  "-----END PRIVATE KEY-----\n";

function getAdminApp() {
  if (_adminApp) return _adminApp;
  if (getApps().length > 0) {
    _adminApp = getApps()[0] as ReturnType<typeof initializeApp>;
    return _adminApp;
  }
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const useEmulator = process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST;

  if (privateKey && clientEmail) {
    _adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      } as ServiceAccount),
      storageBucket,
    });
    return _adminApp;
  }

  if (useEmulator && projectId) {
    _adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail: "emulator@emulator.iam.gserviceaccount.com",
        privateKey: EMULATOR_DUMMY_PRIVATE_KEY,
      } as ServiceAccount),
      storageBucket: storageBucket ?? undefined,
    });
    return _adminApp;
  }

  throw new Error(
    "Missing Firebase Admin credentials (FIREBASE_ADMIN_PRIVATE_KEY, FIREBASE_ADMIN_CLIENT_EMAIL). " + "For emulator-only dev, set FIRESTORE_EMULATOR_HOST and FIREBASE_AUTH_EMULATOR_HOST.",
  );
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}

export function getAdminStorage() {
  return getStorage(getAdminApp());
}

export function getAdminDbSafe(): ReturnType<typeof getFirestore> | null {
  try {
    return getAdminDb();
  } catch {
    return null;
  }
}

export const adminAuth = getAdminAuth;
export const adminDb = getAdminDb;
export const adminStorage = getAdminStorage;
