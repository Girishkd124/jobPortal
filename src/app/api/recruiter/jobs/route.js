import Recruiter from "@/models/Recruiter";
import Candidate from "@/models/Candidate";
import { authenticate } from "@/middleware/auth";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(req) {
  try {
    await connectMongoDB();
    const auth = await authenticate(req);
    if (!auth.success || auth.user.role !== "recruiter") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const recruiter = await Recruiter.findById(auth.user.id);
    if (!recruiter) {
      return Response.json({ success: false, message: "Recruiter not found" }, { status: 404 });
    }

    return Response.json({ success: true, jobs: recruiter.jobPosts }, { status: 200 });
  } catch (error) {
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
    await connectMongoDB();
    const auth = await authenticate(req);
  
    if (!auth.success || auth.user.role !== "recruiter") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }
  
    const { title, description, requiredSkills } = await req.json();
    if (!title || !description || !requiredSkills) {
      return Response.json({ success: false, message: "All fields are required" }, { status: 400 });
    }
  
    const recruiter = await Recruiter.findById(auth.user.id);
    recruiter.jobPosts.push({ title, description, requiredSkills });
    await recruiter.save();
  
    return Response.json({ success: true, message: "Job posted successfully" }, { status: 201 });
  }
