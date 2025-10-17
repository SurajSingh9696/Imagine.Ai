const fs = require("fs");
const fetch = require("node-fetch");
const openai = require("../config/openAi.js");

const generateImage = async (prompt) => {
    try {
        console.log("Generating Image with DALL.E");

        const result = await openai.images.generate({
            model: "gpt-image-1",
            prompt: prompt,
            size: "1024x1024",
            quality: "medium",
            n: 1
        });

        const image_url = result.data[0].url;
        console.log("Image URL:", result);

        const imageResponse = await fetch(image_url);
        const buffer = await imageResponse.arrayBuffer();
        fs.writeFileSync("output.png", Buffer.from(buffer));
        console.log("Image saved as output.png");
        
    } catch (error) {
        console.error("Error: " , error);
    }
}

const openaiController = (req , res) => {
    const prompt = req.body.prompt;
    generateImage(prompt);
    res.status(200).json({ message: "Image generation in progress" });
}

module.exports = openaiController;