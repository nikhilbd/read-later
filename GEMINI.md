# GEMINI.md - Project Context & Instructions

## Project Overview
**Read Later** is a modern, full-stack web application designed to help users organize bookmarks with AI-powered summaries. It specializes in extracting content from articles and YouTube videos and uses Google Gemini to generate concise, readable summaries.

### Main Technologies
- **Framework:** Next.js (App Router) with TypeScript
- **Backend-as-a-Service:** Supabase (PostgreSQL, Auth, RLS)
- **AI Engine:** Google Gemini 2.5 Flash (supporting multimodal video processing)
- **Styling:** Tailwind CSS 4
- **Testing:** Vitest
- **Utilities:** `@mozilla/readability` (article extraction), `cheerio` (scraping), `zod` (validation)

### Architecture
- **Frontend:** Server components for data fetching and Client components for interactive states (summarization, archiving, deleting).
- **API Layer:** Next.js API routes handle link management and trigger Gemini summarization.
- **Data Flow:** Users submit a URL -> Metadata is extracted and saved to Supabase -> A background request triggers Gemini to summarize the content -> The summary is persisted and displayed.
- **Security:** Row Level Security (RLS) in Supabase ensures users only access their own links.

---

## Building and Running

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
```

---

## Development Conventions

### Code Style & Standards
- **Strict Typing:** Use TypeScript for all source files. Leverage `zod` for environment variable and schema validation.
- **Surgical Updates:** When modifying existing logic (e.g., metadata extractors or AI prompts), ensure backward compatibility and follow established patterns in `src/lib`.
- **Environment Safety:** All sensitive keys (Supabase, Google AI) must be validated via `src/lib/env.ts`.

### Testing Practices
- **Unit Testing:** Found in `src/lib/__tests__` and `src/components/__tests__`.
- **Validation Mandate:** After any non-trivial change, ensure the project builds and all tests pass using `npm test`.

### Git Workflow
- Do not stage or commit changes unless explicitly requested.
- Propose clear, concise commit messages that explain the "why" behind changes.

---

## Project-Specific Mandates (GEMINI.md Precedence)
1. **Verification First:** Always ensure the code builds (`npm run build`) and compiles before declaring a task complete.
2. **Automated Testing:** Run `npm test` after any logic changes. New features should include corresponding Vitest test cases in the appropriate `__tests__` directory.
3. **Documentation:** Update `README.md` if significant changes are made to the application's architecture or features.
