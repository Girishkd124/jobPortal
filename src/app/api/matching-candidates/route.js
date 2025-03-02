import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb"; // Adjust the import based on your folder structure
import Recruiter from "@/models/Recruiter";

export async function POST(req) {
  try {
    const { jobPostId, pineconeResponse } = await req.json();

    if (!jobPostId || !pineconeResponse?.candidates?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const candidateIds = pineconeResponse.candidates.map((c) => c.metadata.candidateId);

    // Ensure MongoDB is connected
    await connectMongoDB();

    // Fetch job applications where candidateId matches in the specified jobPostId
    const recruiter = await Recruiter.findOne(
      { "jobPosts._id": jobPostId },
      { "jobPosts.$": 1 } // Get only the matching jobPost
    );

    if (!recruiter) {
      return NextResponse.json({ message: "No job post found" }, { status: 404 });
    }

    // Extract matched job applications
    const matchingApplications = recruiter.jobPosts[0].jobApplications.filter((app) =>
      candidateIds.includes(app._id)
    );

    return NextResponse.json({ matchingApplications }, { status: 200 });
  } catch (error) {
    console.error("Error fetching matching candidates:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
