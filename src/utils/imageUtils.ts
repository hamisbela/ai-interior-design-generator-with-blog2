/**
 * Extracts the first image URL from the content of a blog post
 * @param content The markdown content to extract an image from
 * @returns The URL of the first image found, or null if no image is found
 */
export function extractFirstImage(content: string): string | null {
  // Look for image markdown format: ![alt](url)
  const markdownImageRegex = /!\[.*?\]\((.*?)\)/;
  const mdMatch = content.match(markdownImageRegex);
  
  if (mdMatch && mdMatch[1]) {
    return mdMatch[1];
  }
  
  // Look for direct image URLs in the content
  const directImageUrlRegex = /(https?:\/\/.*?\.(jpg|jpeg|png|gif|webp))/i;
  const directMatch = content.match(directImageUrlRegex);
  
  if (directMatch && directMatch[1]) {
    return directMatch[1];
  }
  
  // Look for HTML image tags: <img src="url" />
  const htmlImageRegex = /<img.*?src=["'](.*?)["']/;
  const htmlMatch = content.match(htmlImageRegex);
  
  if (htmlMatch && htmlMatch[1]) {
    return htmlMatch[1];
  }
  
  // No image found
  return null;
}

/**
 * Returns a default featured image URL for blog posts without images
 * @returns A URL for a default blog image
 */
export function getDefaultFeaturedImage(): string {
  const defaultImages = [
    'https://images.unsplash.com/photo-1487611459768-bd414656ea10?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=1920&auto=format&fit=crop'
  ];
  
  // Return a random image from the array
  return defaultImages[Math.floor(Math.random() * defaultImages.length)];
}