# Workspace Canvas

This is a [Next.js](https://nextjs.org) collaborative workspace application with real-time canvas capabilities, built with Supabase for backend services.

## Prerequisites

- Node.js 18+
- pnpm (required by this project)
- A Supabase account and project

## Getting Started

### 1. Install Dependencies

This project uses pnpm as the package manager:

```bash
# Install pnpm globally if you haven't already
npm install -g pnpm

# Install project dependencies
pnpm install
```

### 2. Environment Setup

Copy the `.env.example` file to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your Supabase project credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

Run the SQL schema provided in `schema.sql` in your Supabase project to set up the required tables.

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the workspace canvas.

## Features

- **Real-time Collaboration**: Multiple users can work on the same canvas simultaneously
- **Interactive Canvas**: Create cards, zones, and connections with drag-and-drop functionality
- **Supabase Integration**: Authentication and real-time data synchronization
- **Redis Caching**: Optional caching layer for improved performance
- **TypeScript**: Fully typed codebase for better developer experience

## Project Structure

- `src/app/` - Next.js app router pages and API routes
- `src/components/` - React components (workspace, entities, UI)
- `src/contexts/` - React context providers (Auth, Toast)
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions, types, and configurations

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Technologies

- Next.js 16 with App Router
- React 19
- TypeScript
- Supabase (Auth + Database + Realtime)
- Tailwind CSS 4
- Framer Motion (animations)
- Redis (optional caching)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
