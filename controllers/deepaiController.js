const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require("dotenv").config();


async function generateImage(prompt) {
  const response = await fetch("https://api.deepai.org/api/text2img", {
    method: "POST",
    headers: { "api-key": process.env.DEEP_AI_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
     },
    body: new URLSearchParams({ text: prompt }),
  });
  const data = await response.json();
  console.log("🖼 Image URL:", data);
}

const deepaiController = (req , res) => {
    const prompt = req.body.prompt;
    generateImage(prompt);
    res.status(200).json({ message: "Image generation in progress" });
}

module.exports = deepaiController;