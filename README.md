# Read Later App 📚

A modern, full-stack "Read Later" web application that helps you organize your bookmarks with AI-powered summaries.

![Main Interface](https://via.placeholder.com/800x450.png?text=Read+Later+App+Interface)

## Features

-   **Seamless Authentication**: Secure login with Google via Supabase Auth.
-   **One-Click Saving**: Browser bookmarklet for saving links instantly from any website.
-   **Gemini Native Video Understanding**: Direct YouTube URL processing using Gemini's native multimodal capabilities (`fileUri`).
-   **Advanced Article Extraction**: Uses `@mozilla/readability` to isolate main content, stripping away noise.
-   **Markdown Summary Rendering**: AI-generated summaries are beautifully formatted with headers, lists, and bold text.
-   **Clean, Focus-Oriented UI**: A professional image-free list view with hover-activated archive/delete actions.
-   **Lazy Loading**: Links are saved instantly; summaries are generated in the background.
-   **Rich Metadata**: Displays Site Name, Domain, and Reading Time/Video tags for every link.
-   **State Management**: Easily organize your reading list into "To Read" and "Archive".
-   **Safe Deletion**: Confirmation guardrails for all destructive actions.

## Tech Stack

-   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
-   **Database & Auth**: [Supabase](https://supabase.com/)
-   **AI Model**: [Google Gemini 2.5 Flash](https://ai.google.dev/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with Typography plugin
-   **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown)
-   **Testing**: [Vitest](https://vitest.dev/)

## Getting Started

### 1. Prerequisites

-   A Supabase account.
-   A Google AI API Key (Gemini).

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_AI_API_KEY=your_gemini_api_key
```

### 3. Database Setup

Run the following SQL in your Supabase SQL Editor to create the `links` table:

```sql
create table links (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  url text not null,
  title text,
  description text,
  image_url text,
  site_name text,
  type text,
  summary text,
  reading_time integer,
  status text default 'unread',
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table links enable row level security;

-- Policy: Users can only see their own links
create policy "Users can manage their own links"
  on links for all
  using (auth.uid() = user_id);
```

### 4. Supabase Auth Configuration

1.  Enable **Google** as an Auth Provider in Supabase.
2.  Add your app URL (Local & Production) to the **Redirect URLs**:
    -   `http://localhost:3000/auth/callback`
    -   `https://your-app.vercel.app/auth/callback`

### 5. Installation & Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Run unit tests
npm test
```

## Deployment

The app is optimized for [Vercel](https://vercel.com/). Connect your GitHub repository and ensure all Environment Variables are added in the Vercel project settings.

---

Built with ❤️ by [Nikhil](https://github.com/nikhilbd)
