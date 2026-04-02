const express = require('express');
const path = require('path');
const app = express();
app.use(express.json({ limit: '20mb' }));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/debug', (req, res) => {
  const key = process.env.ANTHROPIC_API_KEY;
  res.send(key ? 'KEY OK: ' + key.slice(0,15) : 'NO KEY FOUND');
});

app.post('/api/analyze', async (req, res) => {
  const apiKey = (process.env.ANTHROPIC_API_KEY || '').trim();
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set on server.' });
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify(req.body)
    });
    res.json(await r.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(process.env.PORT || 3000, () => console.log('Running'));
