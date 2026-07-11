# PromptWars Submission Checklist

## Core Value

RainGuard AI converts weather and household context into practical monsoon safety actions. It prioritizes emergency usability, fallback behavior, accessibility, and secure AI integration.

## What To Demo

1. Dashboard weather update for Mumbai and a second searched city.
2. Preparedness plan with a ground-floor home, multiple family members, infants, elderly members, pets, and chronic illness selected.
3. Emergency kit progress update and reset.
4. Travel Sentinel for two-wheeler and public transit.
5. Safety Hub contacts changing for an international location.
6. AI Safety Responder question about flooding or fever.
7. Gemini fallback by running without `GEMINI_API_KEY`.
8. Language switch to German or Chinese.
9. Text-size and high-contrast modes.

## Quality Signals

- Zero package dependencies and zero build step.
- Server-only API key handling.
- Same-origin, validation, rate limiting, CSP, and safe rendering protections.
- Offline/deterministic fallbacks for AI workflows.
- Unit tests for storage, weather labels, translations, fallback plans, and Markdown escaping.

## Final Validation Commands

```bash
node --check api/gemini.js
node --check server.js
node --check src/js/app.js
node --check src/js/gemini.js
node --check src/js/storage.js
node --check tests/app.test.js
node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8')); console.log('vercel.json ok')"
npm test
git diff --check
```
