const { InferenceClient } = require("@huggingface/inference");
const fs = require('fs').promises;
const path = require('path');
require("dotenv").config();

const client = new InferenceClient(process.env.HUGGING_FACE_API_KEY);

// // Function to ensure directory exists
// const ensureDirectoryExists = async (dirPath) => {
//     try {
//         await fs.access(dirPath);
//     } catch (error) {
//         await fs.mkdir(dirPath, { recursive: true });
//         console.log(`Created directory: ${dirPath}`);
//     }
// };

// // Function to save blob as image file
// const saveImageToFile = async (blob, filename, directory = './generated-images') => {
//     try {
//         await ensureDirectoryExists(directory);
        
//         // Convert blob to buffer
//         const arrayBuffer = await blob.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);
        
//         // Create full file path
//         const filePath = path.join(directory, filename);
        
//         // Save file
//         await fs.writeFile(filePath, buffer);
//         console.log(`Image saved successfully: ${filePath}`);
        
//         return filePath;
//     } catch (error) {
//         console.error('Error saving image:', error);
//         throw error;
//     }
// };


// Enhanced version with progress simulation and queue updates
const generateImageWithUpdates = async (prompt, options = {}) => {
    try {
        console.log("Generating Image for prompt: ", prompt);

        // Simulate queue updates (Hugging Face doesn't have real-time progress)
        const simulateProgress = () => {
            const steps = ["pending", "processing", "generating", "completed"];
            let currentStep = 0;
            
            const interval = setInterval(() => {
                if (currentStep < steps.length) {
                    console.log("Status Update: ", steps[currentStep]);
                    
                    // Simulate progress percentage
                    const progress = Math.min(100, (currentStep / steps.length) * 100);
                    console.log(`Progress: ${Math.round(progress)}%`);
                    
                    currentStep++;
                } else {
                    clearInterval(interval);
                }
            }, 1000);
        };

        simulateProgress();

        const result = await client.textToImage({
            provider: "replicate",
            model: "tencent/HunyuanImage-3.0",
            inputs: prompt,
            parameters: {
                num_inference_steps: options.num_inference_steps || 5,
                guidance_scale: options.guidance_scale || 7.5,
                width: options.width || 1024,
                height: options.height || 1024,
                num_images: options.num_images || 1,
                ...options.parameters
            },
        });

        console.log("\nImage generated successfully" + (result ? "" : " but no result returned"));
        
        // Create comprehensive result object
        const imageResult = {
            images: [{
                blob: result,
                url: URL.createObjectURL(result),
                size: result.size,
                type: result.type,
                timestamp: new Date().toISOString()
            }],
            prompt: prompt,
            model: "tencent/HunyuanImage-3.0",
            parameters: options.parameters || {}
        };

        console.log("Result: ", imageResult);
        console.log("\nImage URL: ", imageResult.images[0].url);

        return imageResult;
        
    } catch (error) {
        console.error("Error generating image: ", error);
        throw error;
    }
}

// Controller function
const hfController = async (req, res) => {
    try {
        const prompt = req.body.prompt || "A fantasy landscape with castles and dragons";
        console.log("Controller received prompt: ", prompt);
        
        const result = await generateImageWithUpdates(prompt, {
            num_inference_steps: 10,
            guidance_scale: 8.0,
            width: 1024,
            height: 1024,
            parameters: {
                negative_prompt: "blurry, low quality"
            }
        });

        // Send response to client
        res.status(201).json({
            success: true,
            message: "Image generated successfully",
            imageUrl: result.images[0].url,
            prompt: prompt
        });

    } catch (error) {
        console.error("Error in controller:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// // Additional function to get all saved images
// const getSavedImages = async (directory = './generated-images') => {
//     try {
//         await ensureDirectoryExists(directory);
//         const files = await fs.readdir(directory);
//         const imageFiles = files.filter(file => 
//             file.toLowerCase().endsWith('.png') || 
//             file.toLowerCase().endsWith('.jpg') || 
//             file.toLowerCase().endsWith('.jpeg')
//         );
//         return imageFiles.map(file => ({
//             filename: file,
//             path: path.join(directory, file)
//         }));
//     } catch (error) {
//         console.error('Error reading saved images:', error);
//         throw error;
//     }
// }

// Export multiple functions for different use cases
module.exports = hfController;