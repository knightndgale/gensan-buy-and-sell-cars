export function getAuthErrorMessage(error: unknown): string {
  const authError = error as { code?: string };
  const code = authError?.code;
  if (typeof code === "string") {
    const messages: Record<string, string> = {
      "auth/user-not-found": "Invalid email or password. Please check your credentials and try again.",
      "auth/wrong-password": "Invalid email or password. Please check your credentials and try again.",
      "auth/invalid-credential": "Invalid email or password. Please check your credentials and try again.",
      "auth/invalid-email": "Invalid email or password. Please check your credentials and try again.",
      "auth/too-many-requests": "Too many failed attempts. Please try again later.",
      "auth/user-disabled": "This account has been disabled. Please contact support.",
      "auth/network-request-failed": "Network error. Please check your connection and try again.",
    };
    if (messages[code]) return messages[code];
  }
  return "Login failed. Please try again.";
}
