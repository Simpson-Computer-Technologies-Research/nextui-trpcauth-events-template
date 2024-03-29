/**
 * SHA256 Hashing
 *
 * @param text - Text to hash
 * @returns The hashed text
 */
export async function sha256(text: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Base64 Encoding
 *
 * @param text - Text to encode
 * @returns The encoded text
 */
export function base64encode(text: string): string {
  const buff: number[] = [];
  for (let i = 0; i < text.length; i++) {
    buff.push(text.charCodeAt(i));
  }

  return btoa(String.fromCharCode.apply(null, buff));
}

/**
 * Base64 Decoding
 *
 * @param text - Text to decode
 * @returns The decoded text
 */
export function base64decode(text: string): string {
  const buff = atob(text);
  const arr = [];
  for (let i = 0; i < buff.length; i++) {
    arr.push(buff.charCodeAt(i));
  }

  return String.fromCharCode.apply(null, arr);
}
