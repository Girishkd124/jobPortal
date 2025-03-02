import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "@/lib/mongodb";
import Candidate from "@/models/Candidate";
import Recruiter from "@/models/Recruiter";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { name, email, password, role,company}=await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    if (role === "candidate") {
      user = await Candidate.create({ name, email, password: hashedPassword });
    } else if (role === "recruiter") {
      
      user = await Recruiter.create({ name, email, password: hashedPassword, company });
    } else {
      return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json({ success: true, token, role }, { status: 201 });

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
