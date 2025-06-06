/**
 * Generates a random filename with the given extension and length.
 *
 * @param {string} [extension="jpg"] - The file extension
 * @param {number} [length=12] - The length of the filename
 * @returns {string} - The generated random filename
 */
export function generateRandomFilename(extension = "jpg", length = 12) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let name = "";
  for (let i = 0; i < length; i++) {
    name += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${name}.${extension}`;
}
