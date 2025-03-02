import mongoose from "mongoose";

const RecruiterSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, required: true }, // Added password field
  company: String,
  jobPosts: [
    {
      title: String,
      description: String,
      requiredSkills: [String],
      jobApplications: [
        {
           _id: String,
          name: String,
          email: String,
          linkedin: String,
          resume: String, // File path or URL
          skills: [String], // Array of skills
          experience: Number,
          appliedAt: { type: Date, default: Date.now },
        }
      ]
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Recruiter || mongoose.model("Recruiter", RecruiterSchema);
