# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AircoLimburgAanbieding.nl is a local SEO-optimized website for airconditioning services in Limburg, Netherlands. Built with vanilla HTML/CSS/JavaScript using Vite as the development server. The site focuses on conversion optimization and local search visibility.

## Commands

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Core JavaScript Architecture (`assets/js/main.js`)

The application uses a class-based architecture with the following key components:

1. **CONFIG object** (lines 4-21): Central configuration for EmailJS and typewriter effect
2. **Navigation class** (lines 53-152): Handles navbar transparency, mobile menu, and smooth scrolling
3. **TypewriterEffect class** (lines 154-197): Animated text in hero section
4. **FormHandler class** (lines 209-414): EmailJS integration with retry logic and validation
5. **App class** (lines 596-660): Main application initialization with delayed FormHandler loading

### Critical EmailJS Implementation

The FormHandler has a specific initialization pattern to handle EmailJS loading:
- Waits for EmailJS global to be available before initializing
- Uses retry mechanism with 100ms delays
- Template parameters include both Dutch and English field names for compatibility
- Includes `full_message` field as fallback for email templates

### Page Structure

- **Homepage (`index.html`)**: Hero section, services grid, FAQ with Schema.org markup
- **Product page (`producten.html`)**: Inline JavaScript for filtering, uses data attributes
- **City pages (`/steden/*.html`)**: SEO-optimized landing pages with hidden stad field

### Build Configuration

- **Vite config**: Terser minification, drops console logs in production
- **Netlify config**: Headers for security, redirects for SEO, static site deployment
- **Git**: Large JPG files excluded (installation photos), keeps repo under 35MB

## Key Implementation Details

### Navbar Behavior
- Transparent on homepage until scroll > 100px
- Always visible on pages with `navbar-always-visible` class on body
- Mobile menu with hamburger toggle

### Form Handling
All forms use class `contact-form` and are handled by FormHandler. Critical points:
- EmailJS must load before form initialization
- Service ID: `service_1rruujp`
- Template ID: `template_rkcpzhg`
- Public key: `sjJ8kK6U9wFjY0zX9`

### Image Paths
- Product images: `/public/images/products/` (WebP format)
- Brand logos: `/public/images/brands/` (SVG format)
- Large installation photos excluded from Git

### SEO Structure
- Meta titles optimized for SERP CTR
- FAQ section with Schema.org markup
- Local business structured data
- City-specific landing pages with unique content

## Common Issues

1. **EmailJS not sending data**: Ensure EmailJS CDN loads before main.js
2. **Product images not showing**: Check paths start with `/public/`
3. **Navbar text unreadable**: Add `navbar-always-visible` to body class
4. **Build errors with modules**: Add `type="module"` to script tags

## Development Workflow

1. Run `npm run dev` for local development
2. Test forms in browser console - check for EmailJS initialization
3. Build with `npm run build` before committing
4. Git push automatically deploys via Netlify

## Contact

- Domain: aircolimburgaanbieding.nl
- Phone: 046-202-1430
- Email: info@staycoolairco.nl