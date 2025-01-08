'use server'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { FREE_LIMIT, PRO_LIMIT } from "@/hooks/useSubscription";
import { auth } from "@clerk/nextjs/server";

async function transcript(prevState: any, formData: FormData) {
    // console.log("PREV STATE: ", prevState);
    auth().protect();
    
    
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("API_KEY is not configured");
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const file = formData.get('audio') as File;
    if (!file || file.size === 0) {
        return {
            sender: "",
            response: "No audio file uploaded."
        }
    }

    try {
        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), 'uploads');
        if (!existsSync(uploadsDir)) {
            mkdirSync(uploadsDir);
        }

        // Save the file temporarily
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filepath = join(uploadsDir, `audio-${Date.now()}.mp3`);
        await writeFile(filepath, buffer);

        // Convert to base64
        const base64AudioFile = buffer.toString('base64');

        // Initialize Gemini model
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        // Generate content
        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: "audio/mp3",
                    data: base64AudioFile
                }
            },
            { text: "Please transcribe the audio from any language to english." },
        ]);

        const response = await result.response.text();
        // console.log("Response: ",response)
        
        // Clean up: Delete the temporary file
        // await unlink(filepath);

        return {
            sender: file.name,
            response: response
        };

    } catch (error) {
        console.error('Error processing audio:', error);
        return {
            sender: "",
            response: "Error processing audio file: " + (error as Error).message
        };
    }
}

export default transcript;