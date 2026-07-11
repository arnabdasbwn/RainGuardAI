async function getRequestBody(req) {
  if (req.body && (typeof req.body === 'object' || (typeof req.body === 'string' && req.body.trim() !== ''))) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }

  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', err => {
      reject(err);
    });
  });
}

const GEMINI_API_KEY_ENV_NAMES = [
  'GEMINI_API_KEY',
  'GOOGLE_GEMINI_API_KEY',
  'GOOGLE_API_KEY',
  'API_KEY'
];
const DEFAULT_GEMINI_MODELS = ['gemini-3.5-flash', 'gemini-2.5-flash'];

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const { apiKey, envName } = getGeminiApiKey();
  if (isPlaceholderApiKey(apiKey)) {
    return res.status(503).json({
      error: `Gemini API key is not configured on the server. Add one of these environment variables: ${GEMINI_API_KEY_ENV_NAMES.join(', ')}.`
    });
  }

  try {
    const requestBody = await getRequestBody(req);
    const result = await callGemini(requestBody, apiKey);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Gemini-Model', result.model);
    return res.status(200).send(result.text);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message, envName });
  }
}
