import Candidate from "@/models/Candidate";
import Recruiter from "@/models/Recruiter";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { email, password, role } = await req.json();

    // Choose model based on role
    const UserModel = role === "recruiter" ? Recruiter : Candidate;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Create Response and Set Cookie
    const response = NextResponse.json({ success: true, role,token }, { status: 200 });

    response.cookies.set("token", token, {
      httpOnly: true,  // Prevents XSS attacks
      secure: process.env.NODE_ENV === "production", // Ensures cookie is sent over HTTPS in production
      sameSite: "strict", // CSRF protection
      maxAge: 3600, // Token expires in 1 hour
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
