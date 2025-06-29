# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the AircoLimburgAanbieding.nl codebase.

## Project Overview

AircoLimburgAanbieding.nl is a local SEO-optimized website for airconditioning services in Limburg, Netherlands. Built with vanilla HTML/CSS/JavaScript using Vite as the development server.

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Build Tool**: Vite
- **Email Service**: EmailJS (service_1rruujp, template_rkcpzhg)
- **Deployment**: Netlify (configured)
- **Version Control**: Git

## Common Commands

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

## Architecture & Code Structure

### Directory Structure
```
/
├── index.html                 # Homepage with hero, services, FAQ
├── producten.html            # Product showcase page
├── steden/                   # City-specific landing pages
│   ├── maastricht.html
│   ├── sittard.html
│   └── heerlen.html
├── assets/
│   ├── css/
│   │   └── main.css         # Complete CSS framework
│   └── js/
│       ├── main.js          # Core JavaScript (navigation, forms, animations)
│       └── products.js      # Product filtering logic
├── public/
│   └── images/
│       ├── products/        # Product images
│       └── brands/          # Brand logos (SVG)
├── vite.config.js           # Vite configuration
├── netlify.toml             # Netlify deployment config
└── .gitignore               # Excludes large JPG files
```

### Key Components

1. **Navigation System** (`assets/js/main.js:53-152`)
   - Transparent navbar that becomes solid on scroll
   - Mobile-responsive hamburger menu
   - Smooth scroll for anchor links
   - Special handling for pages without hero section using `navbar-always-visible` class

2. **Form Handler** (`assets/js/main.js:199-331`)
   - EmailJS integration for all contact forms
   - Form validation and error handling
   - Success/error message display
   - Analytics tracking for conversions

3. **Product Showcase** (`assets/js/products.js`)
   - Dynamic product grid with filtering
   - Category and brand filters
   - Responsive layout

4. **SEO Optimizations**
   - Meta titles and descriptions optimized for CTR
   - FAQ section with Schema.org markup
   - Local business structured data
   - City-specific landing pages

## Important Configuration

### EmailJS Settings
```javascript
const CONFIG = {
  emailjs: {
    serviceId: 'service_1rruujp',
    templateId: 'template_rkcpzhg',
    publicKey: 'sjJ8kK6U9wFjY0zX9'
  }
}
```

### Design System
- **Primary Color**: Orange (#F97316)
- **Font**: Inter
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

## Common Tasks

### Adding a New City Page
1. Create new HTML file in `/steden/` directory
2. Copy structure from existing city page
3. Update meta tags and content for specific city
4. Add to sitemap section in footer
5. Update Netlify redirects if needed

### Updating Product Catalog
1. Add product images to `/public/images/products/`
2. Update product data in `/assets/js/products.js`
3. Ensure images are optimized (WebP format preferred)

### Modifying Navigation
1. Edit navigation structure in all HTML files
2. Update mobile menu in `main.js` if adding new items
3. Test smooth scroll functionality for new sections

### Form Submissions
All forms use EmailJS. To test:
1. Fill out form with test data
2. Check browser console for errors
3. Verify email receipt at info@staycoolairco.nl

## Performance Considerations

1. **Images**: Large JPG files are excluded from Git. Use optimized formats
2. **Critical CSS**: Main CSS is loaded with high priority
3. **Lazy Loading**: Implemented for images below the fold
4. **Code Splitting**: EmailJS loaded as separate chunk

## Deployment

The site is configured for Netlify deployment:
- Build command: `npm run build`
- Publish directory: `dist`
- Headers and redirects configured in `netlify.toml`

## Testing Checklist

Before committing changes:
- [ ] Test mobile responsiveness
- [ ] Verify form submissions work
- [ ] Check navigation on all pages
- [ ] Validate SEO meta tags
- [ ] Test page load speed
- [ ] Ensure no console errors

## Known Issues & Solutions

1. **Navbar Text Visibility**: Pages without hero sections need `navbar-always-visible` class on body
2. **Large Repository Size**: Installation photos excluded via .gitignore to keep repo under 35MB
3. **Mobile Sticky CTA**: Only visible on mobile devices (max-width: 768px)

## Contact & Support

- **Domain**: aircolimburgaanbieding.nl
- **Phone**: 046-202-1430
- **Email**: info@staycoolairco.nl
- **GitHub**: Repository available for version control