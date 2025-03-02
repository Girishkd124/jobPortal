import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { connectMongoDB } from "@/lib/mongodb";
import Recruiter from "@/models/Recruiter";
// import pdfParse from "pdf-parse";
// import PdfParse from "pdf-parse";
import { parseResumeFromFile } from "@/lib/resumeParser";
import { storeResumeEmbedding } from "@/lib/storeResume";
import { authenticate } from "@/middleware/auth";

export async function POST(req) {
  try {
    await connectMongoDB(); // Ensure DB is connected
    const auth = await authenticate(req);
   
    const formData = await req.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const linkedin = formData.get("linkedin");
    const skills = formData.get("skills")?.split(",").map((s) => s.trim());
    const experience = parseInt(formData.get("experience"), 10);
    const resume = formData.get("resume"); // File object
    const recruiterId = formData.get("recruiterId");
    const jobPostId = formData.get("jobPostId"); // Job ID where applying

    if(!resume) {
      return NextResponse.json({ error: "Resume is required" }, { status: 400 });
    }

    

    // console.log("✅ Resume saved at:", filePath);
    // console.log("✅ Form Data:", { name, email, linkedin, skills, experience });

    if (!recruiterId || !jobPostId) {
      return NextResponse.json({ error: "Recruiter ID and Job Post ID are required" }, { status: 400 });
    }

    if (!resume) {
      return NextResponse.json({ error: "Resume file is required" }, { status: 400 });
    }

    // Save file to `public/uploads/`
    const fileBuffer = Buffer.from(await resume.arrayBuffer());
    const filePath = path.join(process.cwd(), "public", "uploads", resume.name);
    await writeFile(filePath, fileBuffer);
    console.log(fileBuffer)

    console.log(" Resume saved at:", filePath);
    console.log("Form Data:", { name, email, linkedin, skills, experience });

    const resumeUrl = `/uploads/${resume.name}`;
console.log(recruiterId)
    // Find recruiter and update the specific job post
    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) {
      return NextResponse.json({ error: "Recruiter not found" }, { status: 404 });
    }
console.log("recruiter")
    // Find the specific job post inside the recruiter's jobPosts array
    const jobPost = recruiter.jobPosts.find((job) => job._id.toString() === jobPostId);
    if (!jobPost) {
      return NextResponse.json({ error: "Job post not found" }, { status: 404 });
    }
console.log("jobpost")
    // Add the applicant to the jobApplications array
    jobPost.jobApplications.push({
      _id:auth.user.id,
      name,
      email,
      linkedin,
      skills,
      experience,
      resume: resumeUrl,
    });
    console.log("jobpost add")
    // await recruiter.save();
    console.log(auth)
    console.log("enter in resume ");
    
// Convert to Buffer
const resumeT=await parseResumeFromFile(resume);
// console.log(resumeT);
console.log(auth)
    console.log(await storeResumeEmbedding(resumeT,auth.user.id,jobPostId));
    
    
    console.log("exit in resume embedding  ");
    await recruiter.save();
    return NextResponse.json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("❌ Error processing application:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
