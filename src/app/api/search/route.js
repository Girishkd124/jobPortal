import { NextResponse } from "next/server";
import { authenticate } from "@/middleware/auth";
import { getTextEmbedding } from "@/lib/embedding";
import { initPinecone } from "@/lib/pinecone";
import Recruiter from "@/models/Recruiter";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    await connectMongoDB();

    // Authenticate user
    const auth = await authenticate(req);
    if (!auth || !auth.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { jobPostId } = await req.json();

    // Fetch Job Description & Skills from Recruiter Model
    const recruiter = await Recruiter.findOne({ 
      _id: auth.user.id, 
      "jobPosts._id": jobPostId 
    });

    if (!recruiter) {
      return NextResponse.json({ message: "Job post not found" }, { status: 404 });
    }

    const jobPost = recruiter.jobPosts.find(job => job._id.toString() === jobPostId);
    if (!jobPost) {
      return NextResponse.json({ message: "Job post not found" }, { status: 404 });
    }

    // Merge job description and required skills
    const jobDescriptionWithSkills = `${jobPost.description}`;
    console.log(jobDescriptionWithSkills)

    // Convert job description to vector
    const jobVector = await getTextEmbedding(jobDescriptionWithSkills);
    if (!jobVector) {
      return NextResponse.json({ message: "Embedding failed" }, { status: 500 });
    }

    // Query Pinecone for relevant candidates (filtered by jobPostId)
    const pinecone = await initPinecone();
    const index = pinecone.Index("resume"); 

    const result = await index.query({
      vector: jobVector,
      topK: 2, // Get top 5 relevant candidates
      filter: { jobPostId: jobPostId }, // ✅ Ensures candidates are from the same job post
      includeMetadata: true,
    });

    return NextResponse.json({ candidates: result.matches }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
