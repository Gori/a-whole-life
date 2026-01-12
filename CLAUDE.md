# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Production build
- `npm run lint` - Run ESLint

## Architecture

This is a Next.js 15 App Router project with:
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4 (using `@import "tailwindcss"` syntax)
- Payload CMS 3.x with SQLite database
- ESLint 9 flat config with Next.js core-web-vitals and TypeScript rules

### Project Structure

- `app/(frontend)/` - Public-facing pages (blog, static pages, home)
- `app/(payload)/` - Payload CMS admin routes (auto-generated, do not modify)
- `src/payload/` - Payload configuration and collections
  - `payload.config.ts` - Main Payload configuration
  - `collections/` - Collection definitions (BlogPosts, Categories, Tags, Media, Pages)
  - `client.ts` - Helper to get Payload client in server components

### Path Aliases

- `@/*` - Maps to project root
- `@/payload/*` - Maps to `./src/payload/*`

### Key Features

- **Blog with Timeline**: Posts support both `lifeDate` (when event occurred) and `lifeAge` fields for life-archive functionality
- **Timeline Toggle**: Archive can be ordered by published date, life date, or life age
- **Filtering**: Posts can be filtered by categories and tags
- **Image Galleries**: Posts support featured images and multi-image galleries with lightbox
- **Static Pages**: CMS-managed pages at `/:slug`
- **Soft Delete**: Posts have `deletedAt` field for soft deletion

### Payload Admin

Access the admin panel at `/admin`. First run requires creating an admin user.
