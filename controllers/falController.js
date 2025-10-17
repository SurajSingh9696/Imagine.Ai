const {fal} = require("@fal-ai/client");

fal.config({
    credentials : process.env.FAL_AI_KEY,
});

const generateImage = async (prompt) => {
    try {
        console.log("Generating Image for prompt: " , prompt);

        const result = await fal.subscribe("fal-ai/flux/dev" , {
            input : {
                prompt : prompt,
                num_images : 1,
                image_size : "1024x1024",
            },
            onQueueUpdate : (update) => {
                console.log("Status Update: " , update.status);
            },
            onProgress : (progress) => {
                console.log(`Progress: ${progress.progress}%`);
            },
        });

        console.log("\n Image generated successfully");
        console.log("Result: ", result);
        
        if(result && result.images && result.images.length > 0) {
            console.log("\n Image Url: " , result.images[0].url);
        }
        else{
            console.log("No Image Url Is Found");
            
        }
        
    } catch (error) {
        console.error("Error generating image: ", error);
    }
}

const falController = async() =>{
    await generateImage("A fantasy landscape with castles and dragons");
};

module.exports = falController;