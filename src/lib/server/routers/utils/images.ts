import { File } from "@web-std/file";

/**
 * Convert a base64 image to a file
 *
 * @param imgb64 The base64 image
 * @param filename The filename
 * @returns The file
 */
export async function imgb64ToFile(imgb64: string, filename: string) {
  const blob = await fetch(imgb64).then((res) => res.blob());
  const file = new File([blob], filename, { type: "image/png" });
  return file;
}
