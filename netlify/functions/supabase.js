exports.handler = async function(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      },
      body: '',
    };
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SECRET = process.env.SUPABASE_SECRET;

  if (!SUPABASE_URL || !SUPABASE_SECRET) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Supabase environment variables not set.' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Invalid JSON: ' + e.message })
    };
  }

  const { table, method, filters, data, returning } = body;

  if (!table) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'No table specified.' })
    };
  }

  // Build Supabase REST URL
  let url = `${SUPABASE_URL}/rest/v1/${table}`;
  const params = [];

  // Apply filters
  if (filters) {
    for (const [key, val] of Object.entries(filters)) {
      params.push(`${key}=eq.${encodeURIComponent(val)}`);
    }
  }

  // Ordering — default by created_at
  params.push('order=created_at.asc');

  if (params.length) url += '?' + params.join('&');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_SECRET}`,
    'apikey': SUPABASE_SECRET,
    'Prefer': returning ? 'return=representation' : 'return=minimal',
  };

  const httpMethod = method || 'GET';

  try {
    const response = await fetch(url, {
      method: httpMethod,
      headers,
      body: ['POST', 'PATCH'].includes(httpMethod) ? JSON.stringify(data) : undefined,
    });

    const text = await response.text();
    let result;
    try { result = JSON.parse(text); } catch { result = text; }

    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Supabase fetch error: ' + err.message })
    };
  }
};
