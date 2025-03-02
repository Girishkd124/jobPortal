import { getTextEmbedding } from "@/lib/embedding";
import { initPinecone } from "@/lib/pinecone";
import { randomUUID } from 'crypto';

export async function storeResumeEmbedding(resumeText,candidateId,jobPostId) {
  try {
    if (!resumeText || !candidateId) {
      return { success: false, message: "Resume text and candidate ID are required" };
    }

    // Generate embedding vector
    const embedding = await getTextEmbedding(resumeText);

    // Initialize Pinecone
    const pinecone = await initPinecone();
    const index = pinecone.Index("resume"); // Replace with your Pinecone index name

    // Store the embedding in Pinecone
    await index.upsert([
      {
        id:  randomUUID(),
        values: embedding,
        metadata: { resumeText,candidateId,jobPostId },
      },
    ]);

    return { success: true, message: "Resume stored successfully" };
  } catch (error) {
    console.error("Error storing resume in Pinecone:", error);
    return { success: false, message: "Internal Server Error" };
  }
}
