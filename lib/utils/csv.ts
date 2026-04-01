import { createHash } from "crypto";

/** Calculate SHA-256 hash of file content for dedup */
export function fileSha256(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}
