import slugify from 'slugify';

/**
 * Creates a SEO friendly slug from a title or other string
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function createSlug(text: string): string {
  return slugify(text, {
    lower: true,        // Convert to lowercase
    strict: true,       // Strip special characters
    trim: true,         // Trim leading and trailing spaces
    replacement: '-',   // Replace spaces with hyphens
  });
}