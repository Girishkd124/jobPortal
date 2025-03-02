import { initPinecone } from '@/lib/pinecone';  
const pinecone = await initPinecone();

export const searchCandidates = async (jobDescriptionVector) => {
  const index = pinecone.Index("resume");

  try {
    const queryResponse = await index.query({
      vector: jobDescriptionVector,
      topK: 5, // Get top 5 most relevant resumes
      includeMetadata: true,
    });

    return queryResponse.matches; // List of best-matching resumes
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
};
