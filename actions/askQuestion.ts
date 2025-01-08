"use server";

import { Message } from "@/components/Chat";
import { adminDb } from "@/firebaseAdmin";
import { FREE_LIMIT, PRO_LIMIT } from "@/hooks/useSubscription";
import { generateLangchainCompletion } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";


type ModelConfig = {
  apiKey: string;
  modelName: string;
  maxOutputTokens?: number;
};

// Helper function to get stored API key from database
async function getStoredApiKey(userId: string): Promise<string | null> {
  try {
    const userDoc = await adminDb.collection("users").doc(userId).get();
    const userData = userDoc.data();
    return userData?.geminiApiKey || null;
  } catch (error) {
    console.error("Error fetching stored API key:", error);
    return null;
  }
}

function createGeminiModel(apiKey: string) {
  return new ChatGoogleGenerativeAI({
    apiKey: apiKey,
    modelName: "gemini-1.5-flash",
    maxOutputTokens: 2048,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
    ],
  });
}

export async function askQuestion(id: string, question: string, customApiKey?: string) {
  auth().protect();
  const { userId } = await auth();
  
  const chatRef = adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .collection("chat");

  // check how many user messages are in the chat
  const chatSnapshot = await chatRef.get();
  const userMessages = chatSnapshot.docs.filter(
    (doc) => doc.data().role === "human"
  );

  //   Check membership limits for messages in a document
  const userRef = await adminDb.collection("users").doc(userId!).get();

  console.log("DEBUG 2", userRef.data());

  try{
    //   check if user is on FREE plan and has asked more than the FREE number of questions
    if (!userRef.data()?.hasActiveMembership) {
      console.log("Debug 3", userMessages.length, FREE_LIMIT);
      if (userMessages.length >= FREE_LIMIT) {
        return {
          success: false,
          message: `You'll need to upgrade to PRO to ask more than ${FREE_LIMIT} questions! 😢`,
        };
      }
    }

    // check if user is on PRO plan and has asked more than 100 questions
    if (userRef.data()?.hasActiveMembership) {
      console.log("Debug 4", userMessages.length, PRO_LIMIT);
      if (userMessages.length >= PRO_LIMIT) {
        return {
          success: false,
          message: `You've reached the PRO limit of ${PRO_LIMIT} questions per document! 😢 please upload a new document`,
        };
      }
      
    }

    // Create the model instance based on user type
    let model;
    if (userRef.data()?.hasActiveMembership && customApiKey) {
      // PRO users can use their own API key
      console.log("DEBUG CUST: ", customApiKey);
      
      model = createGeminiModel(customApiKey);
    } else {
      // Free users use the default API key
      
      // const storedApiKey = await getStoredApiKey(userId!);
      //   if (storedApiKey) {
      //     model = createGeminiModel(storedApiKey);
      //     console.log("DEBUG Key", storedApiKey)
      //     // apiKeyToUse = storedApiKey;
      //   } else {
      //     model = createGeminiModel(process.env.GEMINI_API_KEY!);
      //     console.log("DEBUG D", model);
          
      //   }
    }


    const userMessage: Message = {
      role: "human",
      message: question,
      createdAt: new Date(),
    };

    await chatRef.add(userMessage);

    //   Generate AI Response
    const reply = await generateLangchainCompletion(id, question);

    const aiMessage: Message = {
      role: "ai",
      message: reply,
      createdAt: new Date(),
    };

    await chatRef.add(aiMessage);

    return { success: true, message: null };
  }catch(error: any){
    console.error("Error in askQuestion:", error);
    
    // Check if error is related to invalid API key
    if (error.toString().includes("API key")) {
      return {
        success: false,
        message: "Invalid API key provided. Please check your API key and try again.",
      };
    }
    
    return {
      success: false,
      message: "An error occurred while processing your question. Please try again.",
    };
  }
}

// Helper to store user's API key in Firestore (encrypted)
// export async function storeUserApiKey(userId: string, apiKey: string) {
//   try {
//      // Validate the API key before storing
//      const model = createGeminiModel(apiKey);
//      await model.invoke("test"); // Quick validation
//     // In a production environment, make sure to encrypt the API key before storing
//     await adminDb.collection("users").doc(userId).update({
//       geminiApiKey: apiKey,
//       apiKeyUpdatedAt: new Date(),
//     });
//     return true;
//   } catch (error) {
//     console.error("Error storing API key:", error);
//     return false;
//   }
// }