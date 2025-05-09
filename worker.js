// KasUmumProxyWorker.js
export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // URL Google Apps Script Anda
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbz_UVsSpIFoudG3apARFrmOQOTdyzCXWlrMSG5B8L5E8-3zczx6sWb8qGcwaEiFIKN-/exec';

    try {
      // Clone request dan modifikasi untuk diteruskan ke GAS
      const newRequest = new Request(GAS_URL, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: 'follow'
      });

      const response = await fetch(newRequest);
      
      // Clone response dan tambahkan CORS headers
      const modifiedResponse = new Response(response.body, response);
      modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
      modifiedResponse.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      modifiedResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      
      return modifiedResponse;
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};
