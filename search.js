/**
 * GonaBot — Vercel Serverless Function for Tavily Search
 * File location in your repo: /api/search.js
 *
 * Setup:
 *  1. Vercel Dashboard → your project → Settings → Environment Variables
 *  2. Add: TAVILY_API_KEY = your Tavily key (mark as Secret 🔒)
 *  3. Redeploy — done!
 */

export default async function handler(req, res) {

  // ── CORS ──
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(404).json({ error: 'Not found' });

  try {
    const { query } = req.body;

    const tr = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY, // ✅ Secret, never exposed
        query,
        max_results: 3,
        search_depth: 'basic'
      })
    });

    const data = await tr.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Search failed', details: err.message });
  }
}
