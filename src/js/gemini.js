/**
 * Gemini API Client - Handles REST requests to Google's Gemini models
 */

import { Storage } from './storage.js';

// Default model to use
const PRIMARY_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTIONS = {
  plan: `You are a Senior Emergency Preparedness Advisor specializing in monsoon and flood resilience.
Your job is to generate a comprehensive, highly personalized monsoon preparedness plan based on the user's profile.
Rules:
1. Ground your advice in official disaster management protocols.
2. If the user resides in low-lying ground floors, emphasize elevating appliances, gas canisters, and electrical systems.
3. If they have pets, infants, or elderly members, allocate specific emergency items and steps for them.
4. Output your answer in clean Markdown, using bold headers and lists.
5. Answer strictly in the requested language. If language is Hindi, reply in fluent, easy-to-read Hindi.`,

  travel: `You are a Commuter Safety Officer during severe weather.
Evaluate the safety of a commuter's travel plan based on their origin, destination, transit mode, and weather.
Rules:
1. Provide an overall Safety Rating: 'Green: Safe', 'Yellow: Caution', or 'Red: Do Not Travel'.
2. Give clear reasoning (e.g., two-wheelers are extremely unsafe in heavy winds, low-lying routes are prone to waterlogging).
3. Offer concrete safety guidelines for their specific mode of travel.
4. Output in clean Markdown. Answer in the requested language (English or Hindi).`,

  chat: `You are a resilient Emergency First Responder Chatbot. You assist users with monsoon safety, home waterproofing, health risks, and first aid queries.
Rules:
1. DO NOT give self-treatment medical prescriptions or DIY surgery guidelines.
2. In case of medical emergencies or injuries, instruct the user to contact emergency services immediately (National Emergency: 112, Ambulance: 108).
3. For waterborne diseases (like Dengue, Cholera, Leptospirosis), prioritize clean drinking water, sanitation, and seeing a doctor.
4. Keep answers concise, structured, and easy to read on mobile.
5. Answer in the requested language (English or Hindi).`
};

export const Gemini = {
  /**
   * Helper to make raw API requests to Gemini REST Endpoint
   * @param {string} systemInstruction 
   * @param {string} prompt 
   * @param {string} lang 
   * @returns {Promise<string>}
   */
  async generateContent(systemInstruction, prompt, lang = 'en') {
    const languageInstruction = ` Respond strictly in ${lang === 'hi' ? 'Hindi (हिंदी)' : 'English'}.`;
    const fullSystem = systemInstruction + languageInstruction;

    const requestBody = {
      systemInstruction: {
        parts: [{ text: fullSystem }]
      },
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048
      }
    };

    // 1. Try serverless backend proxy first
    let proxyErrorText = '';
    try {
      const proxyResponse = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      if (proxyResponse.ok) {
        const text = await proxyResponse.text();
        return text;
      } else {
        proxyErrorText = await proxyResponse.text();
        try {
          const errObj = JSON.parse(proxyErrorText);
          if (errObj.error) proxyErrorText = errObj.error;
        } catch (_) {}
      }
    } catch (proxyError) {
      console.warn('Backend API proxy not available or failed.', proxyError);
      proxyErrorText = proxyError.message;
    }

    // 2. Fallback to client-side direct request (using browser-saved API key)
    const key = Storage.getApiKey();
    if (!key || key === 'MOCK_GEMINI_API_KEY_PLACEHOLDER') {
      if (proxyErrorText) {
        throw new Error(`Proxy Error: ${proxyErrorText}`);
      }
      throw new Error('API_KEY_MISSING');
    }

    try {
      return await this._executeRequest(PRIMARY_MODEL, key, requestBody);
    } catch (e) {
      console.warn(`Primary model ${PRIMARY_MODEL} failed, trying fallback ${FALLBACK_MODEL}`, e);
      if (e.message === 'API_KEY_MISSING' || e.message === 'UNAUTHORIZED') {
        throw e;
      }
      return await this._executeRequest(FALLBACK_MODEL, key, requestBody);
    }
  },

  /**
   * Private fetch runner
   */
  async _executeRequest(model, key, body) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (response.status === 401 || response.status === 403) {
      throw new Error('UNAUTHORIZED');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Incomplete response received from GenAI API.');
    }
  },

  /**
   * Generates a Personalized Preparedness Plan
   * @param {Object} profile 
   * @param {string} lang 
   */
  async generatePreparednessPlan(profile, lang = 'en') {
    const prompt = `Generate a personalized monsoon preparedness plan for the following user profile:
- Name: ${profile.name}
- Current City/Region: ${profile.city}
- Housing Type: ${profile.housing} (ground_floor, high_rise, or temporary_shelter)
- Household Family Size: ${profile.familySize}
- Specific vulnerabilities in the household: ${profile.vulnerabilities ? profile.vulnerabilities.join(', ') : 'None'}
- Special notes: ${profile.notes || 'None'}`;

    return this.generateContent(SYSTEM_INSTRUCTIONS.plan, prompt, lang);
  },

  /**
   * Generates a Weather-Aware Travel Advisory
   * @param {Object} travelDetails 
   * @param {Object} current_weather 
   * @param {string} lang 
   */
  async generateTravelAdvisory(travelDetails, current_weather, lang = 'en') {
    const prompt = `Evaluate commute safety details:
- Route: From "${travelDetails.origin}" to "${travelDetails.destination}"
- Transit Mode: ${travelDetails.mode} (walking, two_wheeler, car, public_transit)
- Current Weather in City: Temp ${current_weather.temp}°C, Precipitation: ${current_weather.precipitation}mm, Wind: ${current_weather.windSpeed} km/h, Weather Code: ${current_weather.weatherCode}`;

    return this.generateContent(SYSTEM_INSTRUCTIONS.travel, prompt, lang);
  },

  /**
   * Interactive Q&A Responder
   * @param {string} question 
   * @param {Array} chatHistory [{ role: 'user'|'model', text: '...' }]
   * @param {string} lang 
   */
  async askSafetyQuestion(question, chatHistory = [], lang = 'en') {
    // Compile chat history to feed into prompt
    let prompt = '';
    if (chatHistory.length > 0) {
      prompt += "Conversation history:\n";
      chatHistory.forEach(item => {
        prompt += `${item.role === 'user' ? 'User' : 'Assistant'}: ${item.text}\n`;
      });
      prompt += "\n";
    }
    prompt += `User Question: ${question}\nAssistant:`;

    return this.generateContent(SYSTEM_INSTRUCTIONS.chat, prompt, lang);
  }
};
