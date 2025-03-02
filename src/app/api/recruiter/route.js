import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Recruiter from "@/models/Recruiter";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { name, email, company, jobPosts } = await req.json();

    const newRecruiter = new Recruiter({ name, email, company, jobPosts });
    await newRecruiter.save();

    return NextResponse.json({ message: "Recruiter added successfully!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
  