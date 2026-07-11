# Gemini API Setup

RainGuard AI uses Gemini only through the server-side `/api/gemini` proxy. Do not place Gemini API keys in browser code, query strings, localStorage, or committed files.

## 1. Configure Live AI

1. Open Google AI Studio.
2. Create a Gemini API key.
3. Add the key to the hosting environment as:

```bash
GEMINI_API_KEY=your_google_ai_studio_key
```

4. Redeploy or restart the server.

Compatibility aliases are also accepted by the backend: `GOOGLE_GEMINI_API_KEY`, `GOOGLE_API_KEY`, and `API_KEY`.

For local development, create a root `.env` file or set the shell variable before running:

```bash
npm run dev
```

`.env` and `.env*.local` are ignored by Git.

## 2. Proxy Contract

Endpoint:

```text
POST /api/gemini
Content-Type: application/json
```

The frontend sends Gemini-compatible `systemInstruction`, `contents`, and `generationConfig` fields. The proxy normalizes and validates the request before forwarding it to Google.

Proxy protections:

- Same-origin enforcement.
- JSON content-type requirement.
- 12 KB request body cap.
- Prompt and system-instruction length caps.
- Generation config clamping.
- In-memory per-IP rate limiting.
- Server-owned safety instruction.
- Sanitized errors.

## 3. Fallback Behavior

If the proxy is not configured or Gemini fails, the UI does not expose raw stack traces. It switches to local fallback logic:

- Dynamic preparedness plan compiler.
- Travel risk heuristic.
- Offline emergency responder.
- Static Safety Hub guidance.

This is expected behavior for demos where `GEMINI_API_KEY` is intentionally absent.

## 4. Manual Smoke Test

After setting the key and redeploying, verify from the app UI:

- Generate a preparedness plan.
- Ask the AI Responder a flood-safety question.
- Evaluate a Travel Sentinel route.

All three should produce live AI output. Remove or rename the key and redeploy to confirm fallback mode still works.
