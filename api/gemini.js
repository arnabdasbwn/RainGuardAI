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
    const model = 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).send(errorText);
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      const text = data.candidates[0].content.parts[0].text;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(text);
    } else {
      return res.status(500).json({ error: 'Incomplete response received from Gemini.' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message, envName });
  }
}
