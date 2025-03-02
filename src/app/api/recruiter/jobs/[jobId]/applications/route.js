import { NextResponse } from "next/server";
import { authenticate } from "@/middleware/auth";
import Recruiter from "@/models/Recruiter";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(req, { params }) {
  const authResult = await authenticate(req);
  await connectMongoDB();

  if (!authResult.success || authResult.user.role !== "recruiter") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { jobId } = await params;

  try {
    // Find the recruiter who has this specific job posted
    const recruiter = await Recruiter.findOne({ "jobPosts._id": jobId });

    if (!recruiter) {
      return NextResponse.json({ success: false, message: "Job not found or unauthorized" }, { status: 404 });
    }

    // Extract the job with the matching jobId
    const job = recruiter.jobPosts.find((job) => job._id.toString() === jobId);
    
    if (!job) {
      return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
    }

    // Extract all job applications for this job
    const applications = job.jobApplications || [];

    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
