import jwt from "jsonwebtoken";
import Candidate from "@/models/Candidate";
import Recruiter from "@/models/Recruiter";
import { connectMongoDB } from "@/lib/mongodb";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function authenticate(req) {
  await connectMongoDB();

  // ✅ Get the token from cookies
  const token = req.cookies.get("token")?.value; 

  if (!token) {
    return { success: false, message: "No token provided" };
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    let user = await Candidate.findById(decoded.id);
    let role = "candidate";

    if (!user) {
      user = await Recruiter.findById(decoded.id);
      role = "recruiter";
    }

    if (!user) {
      return { success: false, message: "User not found" };
    }

    return { success: true, user: { id: user._id, role } };
  } catch (error) {
    return { success: false, message: "Invalid token" };
  }
}
