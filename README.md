# WordQuest
Free English-learning story game. React + TypeScript + Vite + Tailwind + Lucide. No backend; progress in localStorage.
## Run
`npm install && npm run dev` | `npm run build` | `npm test`
## Deploy (Vercel)
Import the repo; framework Vite; build `npm run build`; output `dist`. Set `VITE_SITE_URL` (canonical) and update `public/sitemap.xml` and `public/robots.txt`.
## Add content
Edit `src/data.ts` (chapters and encounters). Build encounters take `w` (word bank) and `v` (all valid sentences).
## Privacy
No analytics or ads. Speech uses the browser's speech synthesis; some browsers may use online voices. Microphone is never used.
## Limitations
No ad slots, analytics or speaking practice implemented. Not verified in a real browser. Content is four encounters per chapter.
## Licences
Logo and scene illustrations are original SVG. System fonts only.
