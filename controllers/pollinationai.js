const fs = require('fs').promises;
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function downloadImage(imageUrl) {
  
  const response = await fetch(imageUrl);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const buffer = await response.buffer();
  
  return buffer;
}

const controller = async (req, res) => {
  try {
    const { prompt, model = 'flux', width = 1024, height = 1024, seed = 24 } = req.body;
    
    console.log('Received prompt:', prompt);
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&model=${model}`;

    const buffer = await downloadImage(imageUrl);

    // Option 1: Send as base64 (good for JSON APIs)
    const base64Image = buffer.toString('base64');
    res.status(200).json({ 
      image: base64Image,
      format: 'base64',
      message: 'Image generated successfully'
    });

    // Option 2: Send as binary image (better for performance)
    // res.setHeader('Content-Type', 'image/png');
    // res.setHeader('Content-Length', buffer.length);
    // res.status(200).send(buffer);

  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ 
      error: 'Failed to generate image',
      details: error.message 
    });
  }
}

module.exports = controller;