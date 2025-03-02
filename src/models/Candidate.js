import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, required: true }, // Added password field
  linkedin: String,
  resumeText: String, // Extracted text from PDF
  skills: [String], 
  experience: String, 
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);
