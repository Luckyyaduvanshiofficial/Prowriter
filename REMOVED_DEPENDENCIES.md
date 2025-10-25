# Removed Dependencies - Can Install Later

These dependencies were removed from package.json to keep it minimal. Install them when needed:

## AI/LLM Libraries
```bash
npm install @ai-sdk/openai @google/generative-ai
npm install @langchain/community @langchain/core @langchain/google-genai @langchain/openai
npm install langchain together-ai ai
```

## Web Scraping & Data
```bash
npm install axios cheerio @types/cheerio
npm install playwright playwright-core puppeteer
npm install node-html-parser google-search-results-nodejs
```

## Additional UI Components
```bash
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog
npm install @radix-ui/react-aspect-ratio @radix-ui/react-avatar
npm install @radix-ui/react-checkbox @radix-ui/react-collapsible
npm install @radix-ui/react-context-menu @radix-ui/react-hover-card
npm install @radix-ui/react-menubar @radix-ui/react-navigation-menu
npm install @radix-ui/react-popover @radix-ui/react-progress
npm install @radix-ui/react-radio-group @radix-ui/react-scroll-area
npm install @radix-ui/react-separator @radix-ui/react-slider
npm install @radix-ui/react-switch @radix-ui/react-tabs
npm install @radix-ui/react-toggle @radix-ui/react-toggle-group
npm install @radix-ui/react-tooltip
```

## Utilities
```bash
npm install @hookform/resolvers date-fns
npm install cmdk input-otp vaul
npm install embla-carousel-react framer-motion
npm install dotenv
```

## Current Essential Dependencies

The package.json now includes only:

### Core
- Next.js, React, TypeScript
- Tailwind CSS (with plugins)

### Appwrite (BaaS)
- appwrite (client SDK)
- node-appwrite (server SDK)

### UI Components (Essential)
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-label
- @radix-ui/react-select
- @radix-ui/react-slot
- @radix-ui/react-toast
- lucide-react (icons)
- sonner (toast notifications)

### Forms & Validation
- react-hook-form
- zod

### Styling Utilities
- clsx
- tailwind-merge
- class-variance-authority
- next-themes

## Quick Install All AI Dependencies

If you want to add AI content generation features:

```bash
npm install @ai-sdk/openai @google/generative-ai @langchain/openai langchain ai
```

## Quick Install All UI Components

If you need the complete UI component library:

```bash
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-popover @radix-ui/react-tabs @radix-ui/react-switch
```
