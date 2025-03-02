import { NextResponse } from "next/server";
import {connectMongoDB} from "@/lib/mongodb"; // Import MongoDB connection
import Recruiter from "@/models/Recruiter"; // Import Recruiter model

export async function GET() {
  try {
    await connectMongoDB(); // Connect to MongoDB

    // Fetch all recruiters and extract job posts
    const recruiters = await Recruiter.find({}, "jobPosts");

    // Flatten job posts from all recruiters
    const jobs = recruiters.flatMap(recruiter =>
      recruiter.jobPosts.map(job => ({
        id: job._id, // Unique job ID
        title: job.title,
        description: job.description,
        requiredSkills: job.requiredSkills || [],
      }))
    );

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch jobs", error }, { status: 500 });
  }
}
