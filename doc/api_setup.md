# Gemini API Setup & Configuration

This document explains how to configure and use the Google Gemini API in **RainGuard AI**.

## 1. Setup Instructions
To enable live generative safety recommendations, configure a Google AI Studio API key on the server:

1.  Navigate to [Google AI Studio](https://aistudio.google.com/).
2.  Log in with your Google account and click **Create API Key**.
3.  Copy the generated key.
4.  Add the key to your hosting provider as `GEMINI_API_KEY`.
5.  Redeploy or restart the server so the runtime can read the new environment variable.

The backend also accepts `GOOGLE_GEMINI_API_KEY`, `GOOGLE_API_KEY`, or `API_KEY` for compatibility with different host dashboards.

For local development, either set the shell variable before running the server or create a `.env` file in the project root:

```bash
GEMINI_API_KEY=your_google_ai_studio_key
```

## 2. API Key Security & Privacy
RainGuard AI calls Gemini through the server-side `/api/gemini` proxy:

*   Your production API key stays in server environment variables.
*   The key is never exposed in browser JavaScript.
*   Requests are forwarded by the backend to the official Google Generative Language API endpoint (`https://generativelanguage.googleapis.com`).

## 3. Fallback Mechanism
If no key is configured, or if the Gemini API request fails:

*   The app runs in **local offline fallback mode** using pre-configured static resources and rule-based evaluation logic.
*   All features (dashboard advisories, travel assessments, chatbot responder, and plan creation) remain functional without exposing network errors to users.
