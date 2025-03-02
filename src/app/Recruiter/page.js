"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized access. Please login.");
      return;
    }
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/recruiter/jobs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setJobs(data.jobs);
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    if (!token) return setError("Unauthorized. Please log in.");

    const res = await fetch("/api/recruiter/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, requiredSkills: requiredSkills.split(",") }),
    });

    const data = await res.json();
    if (data.success) {
      setTitle("");
      setDescription("");
      setRequiredSkills("");
      fetchJobs();
    } else {
      setError(data.message);
    }
  };

  const fetchApplications = async (jobId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/recruiter/jobs/${jobId}/applications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) {
      setApplications(data.applications);
      setSelectedJob(jobId);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
     Cookies.remove("token");
    router.push("/");
  };

  const handleViewApplications = (jobId) => {
    router.push(`/Recruiter/${jobId}`); // Navigate to the new page
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 font-sans">
      {/* Navbar */}
      <nav className="bg-blue-700 p-4 flex justify-between items-center text-white shadow-lg">
        <h1 className="text-2xl font-bold tracking-wide">🚀 Job Portal</h1>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 text-black">
        <h2 className="text-2xl font-bold text-black mb-4">Recruiter Dashboard</h2>

        {/* Job Posting Form */}
        <form onSubmit={handlePostJob} className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-black">Post a New Job</h3>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input
            type="text"
            placeholder="Job Title"
            className="w-full p-2 border rounded mb-2 text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Job Description"
            className="w-full p-2 border rounded mb-2 text-black"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          <input
            type="text"
            placeholder="Required Skills (comma-separated)"
            className="w-full p-2 border rounded mb-2 text-black"
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            Post Job
          </button>
        </form>

        {/* // Inside the job list rendering */}
{jobs.map((job) => (
  <div
    key={job._id}
    className="relative p-6 border border-gray-300 rounded-xl mb-6 bg-gradient-to-br from-white to-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
  >
    <div className="absolute top-0 left-0 w-full h-2 bg-blue-500 rounded-t-xl"></div>
    <h4 className="text-2xl font-extrabold text-blue-800 mb-3">{job.title}</h4>
    <p className="text-gray-700 leading-relaxed mb-3">{job.description}</p>
    <div className="mt-3">
      <span className="font-semibold text-gray-900">Required Skills:</span>
      <div className="mt-1 flex flex-wrap gap-2">
        {job.requiredSkills.map((skill, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
    <button
      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      onClick={() => handleViewApplications(job._id)}
    >
      View Applications
    </button>
  </div>
))}

{/* Job Applications Section */}
{selectedJob && (
  <div className="mt-8 p-6 border rounded-lg shadow-md bg-gray-50">
    <h3 className="text-xl font-bold text-black mb-4">Job Applications</h3>
    {applications.length === 0 ? (
      <p className="text-gray-500">No applications for this job yet.</p>
    ) : (
      applications.map((app) => (
        <div
          key={app._id}
          className="p-4 border border-gray-300 rounded-lg mb-4 bg-white shadow"
        >
          <h4 className="text-lg font-semibold text-blue-700">{app.name}</h4>
          <p className="text-sm text-gray-600">
            Email: <a href={`mailto:${app.email}`} className="text-blue-500">{app.email}</a>
          </p>
          <p className="text-sm text-gray-600">
            LinkedIn: <a href={app.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500">{app.linkedin}</a>
          </p>
          <p className="text-sm text-gray-600">Experience: {app.experience} years</p>
          <p className="text-sm text-gray-600">Applied On: {new Date(app.appliedAt).toLocaleDateString()}</p>
          <p className="text-sm text-gray-600">
            Skills:{" "}
            {app.skills.length > 0 ? app.skills.join(", ") : "No skills listed"}
          </p>
          <a
            href={app.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View Resume
          </a>
        </div>
      ))
    )}
  </div>
)}

      </div>
    </div>
  );
}
