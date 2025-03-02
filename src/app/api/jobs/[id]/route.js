import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Recruiter from "@/models/Recruiter";

export async function GET(req, { params }) {
  try {
    await connectMongoDB();
    const { id } = await params;


    // Find recruiter with job matching the ID
    const recruiter = await Recruiter.findOne({ "jobPosts._id": id });

     // Find recruiter with job post I

    if (!recruiter) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    // Extract job details
    const job = recruiter.jobPosts.find((job) => job._id.toString() === id);
    return NextResponse.json({ 
      id: job._id,
      title: job.title,
      description: job.description,
      requiredSkills: job.requiredSkills || [],
      company: recruiter.company,
      recruiterId: recruiter._id,
      recruiterName: recruiter.name
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Error fetching job", error }, { status: 500 });
  }
}
