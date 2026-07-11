# Special Features: Bulletins, Notifications & Municipal Contacts

This document details the specifications and behavior of the advanced real-time warning features integrated into **RainGuard AI**.

## 1. Web Push Notifications
To provide immediate warnings for severe hazards, RainGuard AI uses the native **Web Notifications API**:
*   **Trigger**: A push notification is sent immediately when weather data updates and has an active **High Danger (alert)** weather code level (such as heavy rain, torrential showers, or thunderstorms).
*   **Cross-Platform**: Works on both desktop browsers (Chrome, Firefox, Safari, Edge) and mobile environments (Android Chrome using Service Worker fallback `registration.showNotification`).
*   **Permissions**: Prompts the user for notification permissions on initial startup and when submitting the location search form.

## 2. Local Weather News Carousel
The dashboard features an interactive **Local Weather Bulletin** card displaying real-time updates for the active location:
*   **Dynamic Generation**: Headline topics and details are synthesized in real-time from active weather parameters (heavy precipitation triggers local waterlogging updates, wind speeds trigger high wind gusts warning, etc.).
*   **Controls**: Includes visual prev/next buttons and dots to navigate between slides.
*   **Carousel Animation**: Utilizes CSS transitions for fluid transitions between news items.
*   **Auto-Scroll**: Slides automatically advance every 5 seconds.

## 3. Dynamic Municipal Contacts
The contacts section under Safety Hub dynamically updates based on the active weather location:
*   **Local Authorities**: Prepends specific municipal control rooms and disaster management cell cards (e.g. BMC for Mumbai, PMC for Pune, BBMP for Bengaluru, MCD for Delhi) at the top of the contacts list.
*   **Fallback**: Generates local control room cards for other search inputs.
*   **Updates**: Refreshes immediately when changing locations or switching between languages.
