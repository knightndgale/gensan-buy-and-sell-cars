import { randomBytes } from "node:crypto";

const PASSWORD_CHARS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digit: "0123456789",
  symbol: "!@#$%&*",
};

/** Generates a cryptographically secure 14-character password with mixed character types. */
export function generateSecurePassword(): string {
  const length = 14;
  const all =
    PASSWORD_CHARS.lower + PASSWORD_CHARS.upper + PASSWORD_CHARS.digit + PASSWORD_CHARS.symbol;
  const bytes = randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += all[bytes[i]! % all.length];
  }
  return result;
}
