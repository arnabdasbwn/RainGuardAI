# Gemini API Setup & Configuration

This document explains how to configure and utilize the Google Gemini API in **RainGuard AI**.

## 1. Setup Instructions
To enable live generative safety recommendations, a personal API key is required:
1.  Navigate to [Google AI Studio](https://aistudio.google.com/).
2.  Log in with your Google account and click **Create API Key**.
3.  Copy the generated key.
4.  Open the RainGuard AI application in your browser.
5.  Click the **🔑 API Settings** button in the top right header.
6.  Paste your key into the text field and click **Save Settings**.

## 2. API Key Security & Privacy
Because RainGuard AI is a 100% serverless, static frontend application:
*   Your API key is saved **only in your browser's local storage** (`localStorage.rainguard_gemini_api_key`).
*   The key is never sent to any intermediary server or third-party database.
*   Requests are sent directly from your browser to the official Google Generative Language API endpoint (`https://generativelanguage.googleapis.com`).

## 3. Fallback Mechanism
If no key is entered (the default state) or if you clear your key:
*   The app runs in **local offline fallback mode** using pre-configured static resources and rule-based evaluation logic.
*   All features (dashboard advisories, travel assessments, chatbot responder, and plan creation) remain fully functional without calling external endpoints, avoiding network errors.
