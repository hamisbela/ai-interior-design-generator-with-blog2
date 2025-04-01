import { BlogPost } from '../types/blog';
import { createSlug } from '../utils/slugUtils';
import siteConfig from '../config/site';
import { extractFirstImage } from '../utils/imageUtils';

// Use Vite's dynamic import for markdown files
const posts = import.meta.glob('/blog-content/**/*.md', {
  eager: true,
  import: 'default',
  as: 'raw',
});

function extractFrontMatter(content: string) {
  // Simple front matter parser that works in browser
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (!match) {
    return { frontMatter: {}, content };
  }

  const frontMatterStr = match[1];
  const contentStr = match[2];

  // Parse YAML-style front matter
  const frontMatter: Record<string, any> = {};
  frontMatterStr.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      frontMatter[key.trim()] = valueParts.join(':').trim();
    }
  });

  return { frontMatter, content: contentStr };
}

function processMarkdownContent(content: string): string {
  // First, process and isolate complete sentences that contain YouTube links
  // This uses a more careful approach to avoid mixing text with the embed tag
  let processedContent = content.replace(
    /([^.!?]*(?:https?:\/\/(?:www\.)?youtube\.com\/watch\?v=|https?:\/\/youtu\.be\/)([a-zA-Z0-9_-]+)(?:&[^<\s]*)?[^.!?]*[.!?])/g,
    (match, beforeAndUrl, videoId) => {
      // Extract just the YouTube URL
      const urlMatch = match.match(/(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=|https?:\/\/youtu\.be\/)([a-zA-Z0-9_-]+)(?:&[^<\s]*)?/);
      if (!urlMatch) return match;
      
      // Replace just the URL with our embed format, preserving surrounding text
      return match.replace(urlMatch[0], `\n\nyoutube:${urlMatch[2]}\n\n`);
    }
  );
  
  // Also catch standalone YouTube URLs without surrounding text
  processedContent = processedContent.replace(
    /(?:^|\s)(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=|https?:\/\/youtu\.be\/)([a-zA-Z0-9_-]+)(?:&[^<\s]*)?(?:\s|$)/g,
    (match, urlPrefix, videoId) => {
      return match.replace(`${urlPrefix}${videoId}`, `\n\nyoutube:${videoId}\n\n`);
    }
  );
  
  // Fix image URLs in the content - preserve absolute URLs
  processedContent = processedContent.replace(
    /(!\[.*?\]\()(.+?)(\))/g,
    (match, prefix, url, suffix) => {
      // Keep absolute URLs as they are
      if (url.startsWith('http') || url.startsWith('https')) {
        return match;
      }
      
      // Clean any leading ./ or / from the relative path
      const cleanUrl = url.replace(/^\.?\/?/, '');
      
      // For relative paths, ensure they're properly resolved
      return `${prefix}${cleanUrl}${suffix}`;
    }
  );

  // Convert standalone image URLs to markdown syntax
  // This handles direct URLs in the content (not already in markdown image format)
  processedContent = processedContent.replace(
    /(^|\n|\s)(https?:\/\/.*?\.(jpg|jpeg|png|gif|webp))(\s|\n|$)/gi,
    (match, before, url, ext, after) => {
      // Only convert if it's not already part of a markdown link or image
      // Check if the URL is surrounded by markdown link/image syntax
      if (match.includes('](') || match.includes('![')) {
        return match;
      }
      return `${before}![Image](${url})${after}`;
    }
  );

  return processedContent;
}

function getYoutubeThumbnailUrl(videoId: string): string {
  // Use maxresdefault for highest quality YouTube thumbnail
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

function extractVideoId(content: string): string | null {
  // Look for YouTube URLs in the content
  const youtubeMatch = content.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  
  // Also look for our youtube: format
  if (!youtubeMatch) {
    const youtubeEmbed = content.match(/youtube:([a-zA-Z0-9_-]{11})/);
    return youtubeEmbed ? youtubeEmbed[1] : null;
  }
  
  return youtubeMatch ? youtubeMatch[1] : null;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    return Object.entries(posts).map(([path, content]) => {
      // Extract filename from path
      const pathParts = path.split('/');
      const filename = pathParts[pathParts.length - 1];
      
      // Get the content and front matter
      const { frontMatter, content: markdown } = extractFrontMatter(content as string);
      const processedContent = processMarkdownContent(markdown);
      
      // Get the title from front matter or extract it from content
      const title = frontMatter.title || extractTitleFromMarkdown(processedContent);
      
      // Generate a slug from the title if not present in front matter
      const slug = frontMatter.slug 
        ? createSlug(frontMatter.slug) 
        : createSlug(title);
      
      // Try to get a featured image, first from regular image, then from YouTube thumbnail
      let featuredImage = extractFirstImage(processedContent);
      
      // If no image is found, try to get a YouTube video thumbnail
      if (!featuredImage) {
        const videoId = extractVideoId(processedContent);
        if (videoId) {
          featuredImage = getYoutubeThumbnailUrl(videoId);
        }
      }
      
      // Get author from front matter or use default
      const author = frontMatter.author || siteConfig.defaultAuthor;
      
      // Use excerpt from front matter if available
      const excerpt = frontMatter.excerpt;
      
      return {
        title,
        slug,
        date: frontMatter.date || new Date().toISOString(),
        content: processedContent,
        excerpt,
        author,
        featuredImage
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

// Helper function to get a post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const allPosts = await getAllPosts();
  return allPosts.find(post => post.slug === slug) || null;
}

// Helper to get all site URLs for sitemap
export async function getAllUrls() {
  const allPosts = await getAllPosts();
  
  // Base URLs for the site
  const baseUrls = [
    { path: '/', name: 'Home' },
    { path: '/blog/', name: 'Blog' },
    { path: '/about/', name: 'About Us' },
    { path: '/contact/', name: 'Contact Us' },
    { path: '/sitemap/', name: 'Sitemap' }
  ];
  
  // Blog post URLs
  const blogUrls = allPosts.map(post => ({
    path: `/${post.slug}/`,
    name: post.title,
    date: post.date
  }));
  
  return { baseUrls, blogUrls };
}

function extractTitleFromMarkdown(content: string): string {
  // Look for the first # heading
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1].trim() : 'Untitled Post';
}