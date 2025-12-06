## GPU Advisor Chatbot (Next.js + OpenAI)

A minimal, one‑page Next.js app that acts as a focused GPU buying advisor. It uses an API route that calls OpenAI and a simple UI that renders assistant responses in Markdown. Deploys easily on Vercel (free).

### What it does
- **GPU advisor scope**: Guides users to select a GPU for their PC and games/workloads.
- **Stays on topic**: System instructions tell the model to refuse unrelated questions and redirect to GPU advice.
- **Concise, practical answers**: Encourages clarifying questions first, then 3 ranked recommendations.
- **Markdown output**: Assistant messages render with headings, lists, and code formatting.

### Tech
- Next.js App Router (Node runtime)
- API route: `app/api/chat/route.ts` → OpenAI `chat/completions` (model `gpt-4o-mini`)
- UI: `app/page.tsx` with `react-markdown` + `remark-gfm`
- Styles: `app/globals.css`

---

## Quick start
1. Install dependencies
   ```bash
   npm install
   ```
2. Add environment variable
   Create `.env.local` at the project root:
   ```bash
   OPENAI_API_KEY=sk-...
   ```
3. Run the dev server
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`

If you see “Module not found: react-markdown,” run:
```bash
npm install react-markdown remark-gfm
```

---

## Deploy on Vercel
GUI
1. Push this repo to GitHub.
2. In Vercel: New Project → Import your repo.
3. Framework preset: Next.js. Root directory: repository root.
4. Add env var:
   - `OPENAI_API_KEY` = your key (Production, Preview, Development)
5. Deploy.

CLI (optional)
```bash
npm i -g vercel
vercel login
vercel
vercel env add OPENAI_API_KEY production
vercel env add OPENAI_API_KEY preview
vercel env add OPENAI_API_KEY development
vercel --prod
```

---

## Configure the bot
Edit `app/api/chat/route.ts`.

- **System prompt**: `systemPrompt` defines the advisor’s role and boundaries.
- **Model**: default is `gpt-4o-mini`.
- **Generation controls**:
  ```ts
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: openAiMessages,
    temperature: 0.2, // lower = more focused, less creative
    top_p: 0.2,       // optional; lower further reduces drift
    max_tokens: 400
  })
  ```

### Keep it on topic
- Keep `temperature` low (0–0.2) and optionally `top_p` low (0.1–0.3).
- The system prompt instructs the assistant to refuse off‑topic requests and redirect.
- Optionally add a simple server guard (before calling OpenAI) to short‑circuit obvious off‑topic inputs.

---

## File map
- `app/page.tsx`: Chat UI (message list, input, Markdown rendering).
- `app/api/chat/route.ts`: Server endpoint calling OpenAI; where you edit the system prompt and settings.
- `app/globals.css`: Minimal styling for dark UI and Markdown elements.

---

## Notes
- Designed for Hobby‑tier Vercel. Keep responses concise to avoid timeouts.
- You can later add streaming, rate limiting, logging, or analytics as needed.

