import { NextResponse } from "next/server";
import { getTextEmbedding } from "@/lib/embedding";
import { initPinecone } from "@/lib/pinecone";  

export async function POST(req) {
  try {
    const { resumeText } = await req.json();

    if (!resumeText) {
      return NextResponse.json({ message: "Resume text and candidate ID are required" }, { status: 400 });
    }

    const candidateId="uniq"

    // 1️⃣ Generate the embedding vector from resume text
    const embedding = await getTextEmbedding(resumeText);

    // 2️⃣ Get Pinecone index
    const pinecone = await initPinecone();
    const index = pinecone.Index("your-index-name"); // Replace with your Pinecone index name

    // 3️⃣ Store embedding in Pinecone
    await index.upsert([
      {
        id: candidateId, // Unique ID for each candidate
        values: embedding, // 1024-dimensional vector
        metadata: { resumeText }, // Store text as metadata for reference
      },
    ]);

    return NextResponse.json({ message: "Resume stored successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error storing resume in Pinecone:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
