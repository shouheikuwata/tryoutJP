import { createHmac } from "crypto";

function getSecret(): string {
  const secret = process.env.PHONE_HASH_SECRET;
  if (!secret) throw new Error("PHONE_HASH_SECRET is not set");
  return secret;
}

/** Normalize phone number to digits only (Japanese format) */
export function normalizePhone(raw: string): string {
  return raw.replace(/[^0-9]/g, "");
}

/** Generate HMAC-SHA256 hash from normalized phone number */
export function hashPhone(normalizedPhone: string): string {
  const secret = getSecret();
  return createHmac("sha256", secret).update(normalizedPhone).digest("hex");
}

/** Get last 4 digits for display purposes */
export function phoneLast4(normalizedPhone: string): string {
  return normalizedPhone.slice(-4);
}
