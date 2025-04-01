# React Blog Boilerplate

A modern, customizable React blog with Markdown support, built with Vite, React, TypeScript, and Tailwind CSS.

## Features

- **Markdown Blog**: Write your blog posts in Markdown with frontmatter support
- **Search Functionality**: Built-in search for blog posts
- **SEO Optimized**: Meta tags, canonical URLs, and auto-generated sitemap
- **Responsive Design**: Looks great on all devices with Tailwind CSS
- **Fast Performance**: Built with Vite for optimal development and production performance
- **Image Handling**: Automatic featured image extraction from blog posts
- **YouTube Embed Support**: Easily embed YouTube videos in your blog posts
- **Zip File Support**: Upload multiple blog posts at once via zip files

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Blog Content Structure

Blog content can be added in two ways:

1. **Individual markdown files** in the `blog-content` directory
2. **Zip files** containing markdown files in the `blog-zips` directory

When you run `npm run build`, the system will:
1. Extract any zip files from `blog-zips` into the `blog-content` directory
2. Include all markdown files in the build

### Creating Blog Posts

Create a new Markdown file in the `blog-content` directory. Your blog post should include frontmatter at the beginning:

```md
---
title: Your Blog Post Title
date: 2025-04-01
author: Your Name
excerpt: A brief summary of the blog post that will appear in listings
---

# Your Blog Post Title

Your content goes here...
```

### Markdown Features

The blog supports:
- Standard Markdown syntax
- YouTube embeds (`youtube:VIDEO_ID` or regular YouTube URLs)
- Images (with automatic extraction for featured images)
- Code blocks with syntax highlighting
- Tables via GFM (GitHub Flavored Markdown)

## Customization

### Site Configuration

Edit `src/config/site.ts` to customize site-wide settings:

```typescript
const siteConfig = {
  title: "Your Site Name",
  description: "Your site description",
  defaultAuthor: "Default Author Name",
  siteUrl: "https://yoursitename.com",
  // Add more site-wide configuration as needed
};
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```
VITE_SITE_URL=https://yoursitename.com
```

### Main Pages

- **Home Page**: Edit `src/App.tsx` to customize the homepage content
- **About Page**: Edit `src/pages/AboutPage.tsx`
- **Contact Page**: Edit `src/pages/ContactPage.tsx`

### Components

The blog uses a modular component structure:

- `src/components/BlogList.tsx`: Blog listing page
- `src/components/BlogPost.tsx`: Individual blog post display
- `src/components/BlogPreview.tsx`: Blog post previews for homepage
- `src/components/SearchBar.tsx`: Search functionality
- `src/components/Footer.tsx`: Site footer

## Deployment

The project is set up to work with Netlify out of the box. The build command in `package.json` automatically handles the extraction of blog content zip files before building the site.

```
npm run build
```

For other hosting providers, ensure they can run the build command as defined in the package.json file.

## License

This project is MIT licensed.