import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAYcROLY5iJozEaZFyddHVsvQVgTAQye6g"; // Store in .env.local

const genAI = new GoogleGenerativeAI(API_KEY);

export const getTextEmbedding = async (text) => {
    try {
      const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
      const result = await model.embedContent({
        model: "text-embedding-004",
        content: {
          parts: [{ text }],
        },
      });
  
      return result.embedding.values; // Returns the 1024-dimensional vector
    } catch (error) {
      console.error("Embedding Error:", error);
      return null;
    }
  };
