import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://girishkd124:UpC0mgzwqtGy8CoM@cluster0.3mlao.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

export const connectMongoDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGODB_URI, { 
      dbName: "candidate-evaluation",
    });
    console.log("🔥 MongoDB Connected");
    
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};
