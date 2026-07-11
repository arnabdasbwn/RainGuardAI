import { test } from 'node:test';
import assert from 'node:assert';

// 1. Mock Browser Environment for Node.js Testing
globalThis.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, val) { this.store[key] = String(val); },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; }
};

globalThis.sessionStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, val) { this.store[key] = String(val); },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; }
};

// Import code units to test
import { Storage } from '../src/js/storage.js';
import { Weather } from '../src/js/weather.js';
import { compileFallbackPreparednessPlan } from '../src/js/static-data.js';

// Markdown parser local extraction to test formatting logic
function testParseMarkdown(text) {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  
  const lines = html.split('\n');
  let inList = false;
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const itemText = trimmed.substring(2);
      let output = '';
      if (!inList) {
        inList = true;
        output += '<ul>';
      }
      output += `<li>${itemText}</li>`;
      return output;
    } else {
      let output = '';
      if (inList) {
        inList = false;
        output += '</ul>';
      }
      if (trimmed === '') {
        output += '<br/>';
      } else {
        output += `<p>${trimmed}</p>`;
      }
      return output;
    }
  });
  if (inList) processedLines.push('</ul>');
  return processedLines.join('\n');
}

// ---------------------------------------------------------
// TEST GROUP: Storage Operations
// ---------------------------------------------------------
test('Storage Controller - Save and retrieve API Key', () => {
  localStorage.clear();
  assert.strictEqual(Storage.getApiKey(), 'MOCK_GEMINI_API_KEY_PLACEHOLDER');
  
  Storage.setApiKey('test-api-key');
  assert.strictEqual(Storage.getApiKey(), 'test-api-key');
  
  Storage.setApiKey(null);
  assert.strictEqual(Storage.getApiKey(), 'MOCK_GEMINI_API_KEY_PLACEHOLDER');
});

test('Storage Controller - User Profile Persistence', () => {
  localStorage.clear();
  const sampleProfile = {
    name: 'Rajesh',
    city: 'Mumbai',
    housing: 'ground_floor',
    familySize: '4',
    vulnerabilities: ['pets', 'elderly']
  };

  Storage.setProfile(sampleProfile);
  const retrieved = Storage.getProfile();
  
  assert.deepStrictEqual(retrieved, sampleProfile);
});

// ---------------------------------------------------------
// TEST GROUP: Weather Metadata Mapping
// ---------------------------------------------------------
test('Weather Controller - Translate WMO weather codes', () => {
  // Clear Sky
  const clearMeta = Weather.getWeatherMeta(0, 'en');
  assert.strictEqual(clearMeta.text, 'Clear sky');
  assert.strictEqual(clearMeta.alert, 'safe');
  
  // Thunderstorm
  const stormMeta = Weather.getWeatherMeta(95, 'en');
  assert.strictEqual(stormMeta.text, 'Thunderstorm');
  assert.strictEqual(stormMeta.alert, 'alert');
  
  // Hindi Translation
  const hiStorm = Weather.getWeatherMeta(95, 'hi');
  assert.strictEqual(hiStorm.text, 'गरज के साथ तूफान');
});

// ---------------------------------------------------------
// TEST GROUP: Preparedness Plan Compiler
// ---------------------------------------------------------
test('Static Data - Fallback Preparedness Plan Compiler', () => {
  const profile = {
    name: 'Amit',
    city: 'Kolkata',
    housing: 'ground_floor',
    familySize: 3,
    vulnerabilities: ['infants']
  };
  
  const planEn = compileFallbackPreparednessPlan(profile, 'en');
  
  // Should calculate 3 people * 9 liters = 27 liters water stored
  assert.ok(planEn.includes('27 liters'), 'Should calculate correct water requirement');
  assert.ok(planEn.includes('ground floor'), 'Should contain specific housing advice');
  assert.ok(planEn.includes('Baby Safety'), 'Should contain specialized infant advice');
  
  const planHi = compileFallbackPreparednessPlan(profile, 'hi');
  assert.ok(planHi.includes('27 लीटर'), 'Should contain correct calculation in Hindi');
  assert.ok(planHi.includes('भूतल'), 'Should contain housing guidance in Hindi');
});

// ---------------------------------------------------------
// TEST GROUP: Custom Markdown Parser
// ---------------------------------------------------------
test('Markdown Parser - Correct tags replacement', () => {
  // Header test
  const headerHtml = testParseMarkdown('# Extreme Rain Alert');
  assert.ok(headerHtml.includes('<h1>Extreme Rain Alert</h1>'));
  
  // Bold test
  const boldHtml = testParseMarkdown('Please **stay indoors** immediately.');
  assert.ok(boldHtml.includes('<strong>stay indoors</strong>'));
  
  // List test
  const listHtml = testParseMarkdown('* Item 1\n* Item 2');
  assert.ok(listHtml.includes('<ul>'));
  assert.ok(listHtml.includes('<li>Item 1</li>'));
  assert.ok(listHtml.includes('<li>Item 2</li>'));
  assert.ok(listHtml.includes('</ul>'));
});
