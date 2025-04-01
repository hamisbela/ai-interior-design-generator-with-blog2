import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import our utilities (dynamically)
let createSlug;
try {
  const slugUtilsModule = await import('../src/utils/slugUtils.js');
  createSlug = slugUtilsModule.createSlug;
} catch (error) {
  // Fallback if import fails
  createSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
}

// Load site config or use defaults
let siteConfig;
try {
  const configModule = await import('../src/config/site.js');
  siteConfig = configModule.default;
} catch (error) {
  // Try to get the site URL from environment variable
  let siteUrl = process.env.VITE_SITE_URL || "https://aiinteriordesigngenerator.com"
  
  // Fallback in case the environment variable contains placeholder
  if (siteUrl.includes('${URL}')) {
    console.warn('Warning: VITE_SITE_URL contains a placeholder ${URL}. Using hardcoded URL.');
    siteUrl = "https://aiinteriordesigngenerator.com";
  }
  
  siteConfig = {
    siteUrl: siteUrl,
  };
}

// Constants
const BLOG_CONTENT_DIR = path.join(__dirname, '../blog-content');
const OUTPUT_FILE = path.join(__dirname, '../public/sitemap.xml');
const ROBOTS_FILE = path.join(__dirname, '../public/robots.txt');

// Ensure output directory exists
if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
}

// Function to extract title from markdown content
function extractTitleFromMarkdown(content) {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1].trim() : 'Untitled Post';
}

// Function to extract front matter from markdown
function extractFrontMatter(content) {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (!match) {
    return { frontMatter: {}, content };
  }

  const frontMatterStr = match[1];
  const contentStr = match[2];

  // Parse YAML-style front matter
  const frontMatter = {};
  frontMatterStr.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      frontMatter[key.trim()] = valueParts.join(':').trim();
    }
  });

  return { frontMatter, content: contentStr };
}

// Function to find all markdown files recursively
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Generate the sitemap XML
async function generateSitemap() {
  try {
    console.log('🔄 Generating sitemap.xml...');
    
    // Validate and clean siteUrl
    if (siteConfig.siteUrl.includes('${URL}')) {
      console.warn('Warning: siteUrl contains a placeholder ${URL}. Using hardcoded URL.');
      siteConfig.siteUrl = "https://aiinteriordesigngenerator.com";
    }
    
    console.log(`Using site URL: ${siteConfig.siteUrl}`);
    
    // Base URLs
    const baseUrls = [
      { url: '/', lastmod: new Date().toISOString().split('T')[0], priority: 1.0 },
      { url: '/blog', lastmod: new Date().toISOString().split('T')[0], priority: 0.8 },
      { url: '/about', lastmod: new Date().toISOString().split('T')[0], priority: 0.7 },
      { url: '/contact', lastmod: new Date().toISOString().split('T')[0], priority: 0.7 },
      { url: '/sitemap', lastmod: new Date().toISOString().split('T')[0], priority: 0.5 }
    ];
    
    // Get all markdown files
    const markdownFiles = findMarkdownFiles(BLOG_CONTENT_DIR);
    const blogUrls = [];
    
    // Process each markdown file
    for (const file of markdownFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const { frontMatter, content: markdownContent } = extractFrontMatter(content);
        
        // Get the title from front matter or extract it from content
        const title = frontMatter.title || extractTitleFromMarkdown(markdownContent);
        
        // Generate a slug from the title if not present in front matter
        const slug = frontMatter.slug 
          ? createSlug(frontMatter.slug) 
          : createSlug(title);
        
        // Get the last modification date
        const lastmod = frontMatter.date || new Date().toISOString().split('T')[0];
        
        blogUrls.push({
          url: `/${slug}`,  // Direct URL without /blog/ prefix
          lastmod,
          priority: 0.7
        });
      } catch (err) {
        console.warn(`⚠️ Error processing file ${file}:`, err.message);
      }
    }
    
    // Combine all URLs
    const allUrls = [...baseUrls, ...blogUrls];
    
    // Generate XML with proper XML declaration
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    allUrls.forEach(item => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${siteConfig.siteUrl}${item.url}</loc>\n`;
      if (item.lastmod) {
        sitemap += `    <lastmod>${item.lastmod}</lastmod>\n`;
      }
      if (item.changefreq) {
        sitemap += `    <changefreq>${item.changefreq}</changefreq>\n`;
      }
      if (item.priority) {
        sitemap += `    <priority>${item.priority}</priority>\n`;
      }
      sitemap += '  </url>\n';
    });
    
    sitemap += '</urlset>';
    
    // Write to file with explicit UTF-8 encoding
    fs.writeFileSync(OUTPUT_FILE, sitemap, 'utf8');
    console.log(`✅ Sitemap generated with ${allUrls.length} URLs at: ${OUTPUT_FILE}`);
    
    // Generate robots.txt file
    generateRobotsTxt(siteConfig.siteUrl);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
  }
}

// Generate robots.txt file
function generateRobotsTxt(siteUrl) {
  try {
    console.log('🔄 Generating robots.txt...');
    
    // Clean siteUrl if it contains a placeholder
    if (siteUrl.includes('${URL}')) {
      console.warn('Warning: siteUrl contains a placeholder ${URL} in robots.txt. Using hardcoded URL.');
      siteUrl = "https://aiinteriordesigngenerator.com";
    }
    
    const content = `# robots.txt for ${siteUrl}
User-agent: *
Allow: /

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml

# Block specific directories or files if needed
# Disallow: /private/
# Disallow: /admin/

# Crawl delay for bots (optional)
Crawl-delay: 10
`;
    
    fs.writeFileSync(ROBOTS_FILE, content, 'utf8');
    console.log(`✅ robots.txt generated at: ${ROBOTS_FILE}`);
  } catch (error) {
    console.error('❌ Error generating robots.txt:', error);
  }
}

// Run the sitemap generator
generateSitemap();