const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENROUTER_MGMT_KEY = process.env.OPENROUTER_MGMT_KEY;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Credits API endpoint — proxy to OpenRouter
app.get('/api/credits', async (_req, res) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/credits', {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_MGMT_KEY}`
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return res.status(response.status).json({
        error: `OpenRouter API error (${response.status})`,
        detail: errorBody
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch credits',
      detail: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`OpenRouter Credits dashboard listening on port ${PORT}`);
});
