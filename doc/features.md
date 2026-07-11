# Feature Notes

This document lists the user-facing features and the implementation details most relevant for competition review.

## 1. Dashboard

- Live Open-Meteo weather for the active city.
- Weather risk badge derived from WMO weather codes.
- Local weather bulletin carousel generated from precipitation, wind, and alert severity.
- Nearby-sector weather cards with primary/destination quick actions.
- Country-aware contact refresh when the detected location changes.

## 2. Preparedness Profiler

- Validates name, city, family size, vulnerabilities, and optional notes.
- Gemini plan generation when `/api/gemini` is configured.
- Local deterministic fallback that still computes household quantities and vulnerability-specific guidance.
- Stores only the profile in browser localStorage; no server database is required.

## 3. Emergency Kit Manager

- Builds a checklist from the saved profile.
- Adds specialized items for infants, elderly members, and pets.
- Persists checklist state locally.
- Includes reset and progress tracking.

## 4. Travel Sentinel

- Accepts origin, destination, and mode of travel.
- Supports walking, two-wheeler, car/taxi, and public transit.
- Uses Gemini for contextual route advice when available.
- Falls back to local weather and transit-mode heuristics when AI is unavailable.

## 5. Safety Hub

- Before, during, and after safety guidance.
- Emergency contacts for India and supported international destinations.
- Contact cards use safe DOM text insertion and `tel:` links.
- Guidance list rendering avoids raw HTML injection.

## 6. AI Safety Responder

- Answers preparedness, flood, health, and waterproofing questions.
- System prompts instruct the model not to prescribe medication or give unsafe medical guidance.
- Server proxy appends a second safety policy for direct endpoint calls.
- User text and chat history are treated as untrusted content.

## 7. Accessibility and Internationalization

- Language selector includes directly handled languages only.
- Text-size selector supports normal, large, and extra-large modes.
- Themes include dark, light, and high contrast.
- Semantic sections, ARIA labels, live regions, and keyboard-focused navigation are used throughout.

## 8. Notifications

- Browser notification permission is requested only through user-triggered flows.
- High-danger weather states can trigger local notifications.
- The app remains functional when notification permission is denied.
