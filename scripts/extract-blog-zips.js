import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

const BLOG_CONTENT_DIR = 'blog-content';
const BLOG_ZIPS_DIR = 'blog-zips';

// Ensure the content directory exists
if (!fs.existsSync(BLOG_CONTENT_DIR)) {
  fs.mkdirSync(BLOG_CONTENT_DIR, { recursive: true });
}

// Function to extract zip files
function extractZipFiles() {
  console.log('🔍 Checking for blog content zip files...');
  
  // Check if the blog-zips directory exists
  if (!fs.existsSync(BLOG_ZIPS_DIR)) {
    console.log(`⚠️ No ${BLOG_ZIPS_DIR} directory found. Skipping zip extraction.`);
    return;
  }
  
  // Get all zip files in the directory
  const zipFiles = fs.readdirSync(BLOG_ZIPS_DIR)
    .filter(file => file.endsWith('.zip'));
  
  if (zipFiles.length === 0) {
    console.log('ℹ️ No zip files found in the blog-zips directory.');
    return;
  }
  
  console.log(`🔄 Found ${zipFiles.length} zip file(s). Starting extraction...`);
  
  // Process each zip file
  for (const zipFile of zipFiles) {
    try {
      const zipPath = path.join(BLOG_ZIPS_DIR, zipFile);
      console.log(`📦 Extracting ${zipFile}...`);
      
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(BLOG_CONTENT_DIR, true); // true for overwrite
      
      console.log(`✅ Successfully extracted ${zipFile} to ${BLOG_CONTENT_DIR}`);
    } catch (error) {
      console.error(`❌ Error extracting ${zipFile}:`, error.message);
    }
  }
  
  console.log('🎉 Zip extraction process completed!');
}

// Run the extraction process
extractZipFiles();