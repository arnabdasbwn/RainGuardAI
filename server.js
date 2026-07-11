import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const GEMINI_API_KEY_ENV_NAMES = [
  'GEMINI_API_KEY',
  'GOOGLE_GEMINI_API_KEY',
  'GOOGLE_API_KEY',
  'API_KEY'
];
const DEFAULT_GEMINI_MODELS = ['gemini-3.5-flash', 'gemini-2.5-flash'];

function loadLocalEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (!key || process.env[key]) continue;

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function getGeminiApiKey() {
  for (const name of GEMINI_API_KEY_ENV_NAMES) {
    const value = process.env[name];
    if (typeof value === 'string' && value.trim()) {
      return { apiKey: value.trim(), envName: name };
    }
  }

  return { apiKey: '', envName: '' };
}

function isPlaceholderApiKey(apiKey) {
  return !apiKey || apiKey === 'MOCK_GEMINI_API_KEY_PLACEHOLDER';
}

function getGeminiModels() {
  const configuredModels = (process.env.GEMINI_MODEL || process.env.GOOGLE_GEMINI_MODEL || '')
    .split(',')
    .map(model => model.trim())
    .filter(Boolean);

  return [...new Set([...configuredModels, ...DEFAULT_GEMINI_MODELS])];
}

function partsToText(parts = []) {
  return parts
    .map(part => part?.text)
    .filter(Boolean)
    .join('\n');
}

function toInteractionsPayload(requestBody, model) {
  const systemInstruction = partsToText(requestBody.systemInstruction?.parts);
  const input = (requestBody.contents || [])
    .flatMap(content => content.parts || [])
    .map(part => part?.text)
    .filter(Boolean)
    .join('\n\n');

  const payload = {
    model,
    input
  };

  if (systemInstruction) payload.system_instruction = systemInstruction;
  if (requestBody.generationConfig) {
    payload.generation_config = {
      temperature: requestBody.generationConfig.temperature,
      max_output_tokens: requestBody.generationConfig.maxOutputTokens
    };
  }

  return payload;
}

function extractInteractionsText(data) {
  if (typeof data.output_text === 'string') return data.output_text;
  if (typeof data.outputText === 'string') return data.outputText;

  const lastStep = Array.isArray(data.steps) ? data.steps[data.steps.length - 1] : null;
  const content = lastStep?.content;
  if (Array.isArray(content)) {
    return content
      .map(item => item?.text || item?.content || '')
      .filter(Boolean)
      .join('\n');
  }

  return '';
}

async function readGeminiError(response) {
  const text = await response.text();
  if (!text) return `Gemini API request failed with status ${response.status}.`;

  try {
    const parsed = JSON.parse(text);
    return parsed.error?.message || parsed.error || parsed.message || text;
  } catch (_) {
    return text;
  }
}

async function callGemini(requestBody, apiKey) {
  const errors = [];

  for (const model of getGeminiModels()) {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify(toInteractionsPayload(requestBody, model))
    });

    if (response.ok) {
      const data = await response.json();
      const text = extractInteractionsText(data);
      if (text) return { text, model };

      errors.push({
        model,
        status: 500,
        message: 'Incomplete response received from Gemini.'
      });
      continue;
    }

    const message = await readGeminiError(response);
    errors.push({ model, status: response.status, message });

    if (![404, 429, 503].includes(response.status)) break;
  }

  const lastError = errors[errors.length - 1];
  const detail = errors.map(error => `${error.model}: ${error.status} ${error.message}`).join(' | ');
  const error = new Error(`Gemini API request failed. ${detail}`);
  error.status = lastError?.status || 502;
  throw error;
}

loadLocalEnv();

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Handle local proxy endpoint for Gemini API
  if (req.url.startsWith('/api/gemini') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', async () => {
      const { apiKey, envName } = getGeminiApiKey();
      if (isPlaceholderApiKey(apiKey)) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: `Gemini API key is not configured locally. Add one of these environment variables: ${GEMINI_API_KEY_ENV_NAMES.join(', ')}.`
        }));
        return;
      }

      try {
        const parsedBody = JSON.parse(body);
        const result = await callGemini(parsedBody, apiKey);
        res.writeHead(200, {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Gemini-Model': result.model
        });
        res.end(result.text);
      } catch (err) {
        res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message, envName }));
      }
    });
    return;
  }
  
  // Normalize URL path
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  
  // Prevent directory traversal attacks
  if (!filePath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('File Not Found');
      } else {
        res.statusCode = 500;
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
