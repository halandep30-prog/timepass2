# College Project AI Agent

Turn a project idea into a structured final-year project plan with Gemini.

## Setup
1. Get a free key: https://aistudio.google.com/apikey
2. `cp .env.example .env` and set `VITE_GEMINI_API_KEY=...`
3. `npm install`
4. `npm run dev` -> open http://localhost:5173

## Deploy (Vercel)
Push to GitHub, import the repo in Vercel (Vite preset is auto-detected),
add the env var `VITE_GEMINI_API_KEY`, then deploy.
