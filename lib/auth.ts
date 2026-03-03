import { getAdminAuth } from "@/lib/firebase/admin";
import { getDealerByUserId } from "@/lib/firestore/dealers";

/**
 * Extract session token from Cookie header or Authorization: Bearer header.
 * Supports both for API clients (e.g. Postman) that may not send cookies.
 */
function extractSessionToken(cookieHeader: string | null, authHeader: string | null): string | null {
  const cookieMatch = cookieHeader?.match(/session=([^;]+)/);
  if (cookieMatch?.[1]) return cookieMatch[1];

  const bearerMatch = authHeader?.match(/^Bearer\s+(.+)$/i);
  if (bearerMatch?.[1]) return bearerMatch[1];

  return null;
}

export async function getSessionToken(
  cookieHeader: string | null,
  authHeader?: string | null
): Promise<{ uid: string; role: string } | null> {
  const token = extractSessionToken(cookieHeader, authHeader ?? null);
  if (!token) return null;
  try {
    const decoded = await getAdminAuth().verifySessionCookie(token, true);
    const role = (decoded.role as string) ?? "customer";
    return { uid: decoded.uid, role };
  } catch {
    return null;
  }
}


export async function getDealerForUser(userId: string) {
  return getDealerByUserId(userId);
}
