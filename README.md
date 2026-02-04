# Espresso Dial-In Helper

Minimal, static espresso dial-in helper with shareable guidance.

## Run locally

No dependencies needed.

Option 1: open directly
- Open `index.html` in your browser.

Option 2: simple local server (recommended for clipboard support)

```bash
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

## AI Recipe Maker API

The AI Recipe Maker uses a Vercel serverless function at `/api/recipes` and requires an OpenAI API key.

Set the environment variable:

```bash
export OPENAI_API_KEY="your-key"
```

Local API testing (requires the key):

```bash
npx vercel dev
```

Then open `http://localhost:3000` (or the URL printed by Vercel).
