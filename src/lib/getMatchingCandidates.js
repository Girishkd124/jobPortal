import { connectMongoDB } from "./mongodb.js";
import Recruiter from "../models/Recruiter.js";
console.log("Recruiter Model:", Recruiter);
export const getMatchingCandidates = async (jobPostId, pineconeResponse) => {
  try {
    if (!pineconeResponse?.candidates?.length) {
      return [];
    }

    const candidateIds = pineconeResponse.candidates.map((c) => c.metadata.candidateId);

    // Ensure MongoDB is connected
    await connectMongoDB();

    // Fetch job applications where candidateId matches in the specified jobPostId
    const recruiters = await Recruiter.find(
      { "jobPosts._id": jobPostId, "jobPosts.jobApplications._id": { $in: candidateIds } },
      { "jobPosts.jobApplications.$": 1 } // Project only matching job applications
    );

    // Extract matched job applications
    const matchingApplications = recruiters.flatMap((recruiter) =>
      recruiter.jobPosts.flatMap((jobPost) =>
        jobPost.jobApplications.filter((app) => candidateIds.includes(app._id))
      )
    );

    return matchingApplications;
  } catch (error) {
    console.error("Error fetching matching candidates:", error);
    return [];
  }
};
