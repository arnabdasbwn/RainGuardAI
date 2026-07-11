# Security Notes

## Key Handling

Gemini keys must be configured only as server environment variables. The browser client never stores provider keys and never calls Gemini directly with a user-provided key.

Accepted environment variable names:

- `GEMINI_API_KEY`
- `GOOGLE_GEMINI_API_KEY`
- `GOOGLE_API_KEY`
- `API_KEY`

## Implemented Controls

- Same-origin enforcement for `/api/gemini`.
- JSON content-type enforcement.
- Request body and prompt length limits.
- Generation config clamping.
- In-memory per-IP rate limiting.
- Server-side safety policy appended to Gemini instructions.
- Sanitized API error responses.
- Escaped AI Markdown rendering.
- Safe text-node rendering for guidelines and contact data.
- CSP and other browser security headers in production and local dev.

## Reporting

This is a competition/demo repository. Do not commit secrets. If a key is accidentally exposed, revoke it in the provider dashboard immediately and replace it with a new server-side environment variable.
