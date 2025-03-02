import { useState, useEffect } from "react";

export default function CandidateDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedin: "",
    resumeText: "",
  });

  // Fetch job posts from the API
  useEffect(() => {
    fetch("/api/jobs") // API route for fetching jobs
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle job application submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, jobId: selectedJob.id }),
    });

    if (response.ok) {
      alert("Application submitted successfully!");
      setSelectedJob(null);
    } else {
      alert("Failed to submit application.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 p-4 flex justify-between text-white">
        <h1 className="text-lg font-bold">Job Portal</h1>
        <div>
          <button className="bg-white text-blue-600 px-4 py-2 rounded mr-2">
            Login
          </button>
          <button className="bg-white text-blue-600 px-4 py-2 rounded">
            Register
          </button>
        </div>
      </nav>

      {/* Job Listings */}
      <div className="max-w-4xl mx-auto mt-6">
        <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-4 shadow rounded">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p>{job.description}</p>
              <button
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setSelectedJob(job)}
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Job Application Form */}
      {selectedJob && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md">
            <h2 className="text-xl font-bold mb-4">Apply for {selectedJob.title}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
              <input
                type="text"
                name="linkedin"
                placeholder="LinkedIn Profile URL"
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
              <textarea
                name="resumeText"
                placeholder="Paste your resume text"
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
              >
                Submit Application
              </button>
            </form>
            <button
              className="mt-2 text-red-500 underline"
              onClick={() => setSelectedJob(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
