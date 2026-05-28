/**
 * Cloudflare Pages Function — /api/cashfree/orders
 *
 * This runs server-side on Cloudflare's edge network.
 * It proxies order creation requests to Cashfree's production API,
 * keeping the secret key safely out of the browser bundle.
 *
 * Environment variables (set in Cloudflare Pages dashboard):
 *   CASHFREE_APP_ID     — your Cashfree App ID
 *   CASHFREE_SECRET_KEY — your Cashfree Secret Key
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// Handle POST — create Cashfree order
export async function onRequestPost(context) {
  const { request, env } = context;

  const appId = env.CASHFREE_APP_ID;
  const secretKey = env.CASHFREE_SECRET_KEY;

  if (!appId || !secretKey) {
    return new Response(
      JSON.stringify({ error: 'Cashfree credentials not configured in Cloudflare environment variables.' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }

  let body;
  try {
    body = await request.text();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Failed to read request body.' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }

  try {
    const cashfreeResponse = await fetch('https://api.cashfree.com/pg/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
      },
      body,
    });

    const responseText = await cashfreeResponse.text();

    return new Response(responseText, {
      status: cashfreeResponse.status,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to connect to Cashfree API.' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }
}
