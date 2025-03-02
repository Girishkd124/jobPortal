"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
// import { getMatchingCandidates } from "@/lib/getMatchingCandidates";
export default function JobApplications() {
  const router = useRouter();
  const params = useParams();
  const { jobs: jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [relevantCandidates, setRelevantCandidates] = useState([]); // New State
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!jobId || !token) return;

    fetch(`/api/recruiter/jobs/${jobId}/applications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setApplications(data.applications);
        } else {
          setError(data.message);
        }
      })
      .catch(() => setError("Error fetching applications"));
  }, [jobId, token]);

  // Fetch Relevant Candidates (API: /api/search)
  const fetchRelevantCandidates = async () => {
    if (!jobId || !token) return;
  
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobPostId: jobId }), // Send jobPostId
      });
  
      const data = await response.json();
      fetchMatchingCandidates(jobId,data);
   
      // if (fetchData) {
      //   setRelevantCandidates(fetchData);
      // } else {
      //   setError("No relevant candidates found.");
      // }
    } catch (error) {
      setError("Error fetching relevant candidates.");
    }
  };
  const fetchMatchingCandidates = async (jobPostId, pineconeResponse) => {
    const res = await fetch("/api/matching-candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobPostId, pineconeResponse }),
    });
  
    const data = await res.json();
    setRelevantCandidates(data.matchingApplications);
    console.log("Matching Candidates:", data.matchingApplications);
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Back Button */}
      <button
        className="mb-6 bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-900 transition shadow-md"
        onClick={() => router.back()}
      >
        ← Back
      </button>

      {/* Page Title */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Job Applications</h2>

      {/* Error Message */}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Fetch Relevant Candidates Button */}
      <button
        onClick={fetchRelevantCandidates}
        className="mb-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
      >
        Find Relevant Candidates
      </button>

      {/* Applications List */}
      {applications.length === 0 ? (
        <p className="text-gray-700 text-lg">No applications found for this job.</p>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <div key={app._id} className="p-6 bg-white rounded-lg shadow-md border hover:shadow-lg transition">
              <h4 className="text-xl font-semibold text-gray-900">{app.name}</h4>
              <p className="text-gray-800">
                <span className="font-medium">Email:</span> 
                <a href={`mailto:${app.email}`} className="text-blue-600 hover:underline ml-1">{app.email}</a>
              </p>
              <p className="text-gray-800">
                <span className="font-medium">LinkedIn:</span> 
                <a href={app.linkedin} target="_blank" className="text-blue-600 hover:underline ml-1">{app.linkedin}</a>
              </p>
              <p className="text-gray-800"><span className="font-medium">Experience:</span> {app.experience} years</p>
              <p className="text-gray-800"><span className="font-medium">Applied On:</span> {new Date(app.appliedAt).toLocaleDateString()}</p>
              <p className="text-gray-800"><span className="font-medium">Skills:</span> {app.skills.join(", ")}</p>
              <a href={app.resume} target="_blank" className="text-blue-600 hover:underline font-medium">📄 View Resume</a>
            </div>
          ))}
        </div>
      )}

      {/* Relevant Candidates List */}
      {relevantCandidates.length > 0 && (
        <>
          <h3 className="text-2xl font-bold text-gray-900 mt-8">Relevant Candidates</h3>
          <div className="grid gap-6 mt-4">
            {relevantCandidates.map((candidate) => (
              <div key={candidate._id} className="p-6 bg-white rounded-lg shadow-md border hover:shadow-lg transition">
                <h4 className="text-xl font-semibold text-gray-900">{candidate.name}</h4>
                <p className="text-gray-800">
                  <span className="font-medium">Email:</span> 
                  <a href={`mailto:${candidate.email}`} className="text-blue-600 hover:underline ml-1">
                    {candidate.email}
                  </a>
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">Experience:</span> {candidate.experience} years
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">Skills:</span> {candidate.skills.join(", ")}
                </p>
                <a href={candidate.resume} target="_blank" className="text-blue-600 hover:underline font-medium">
                  📄 View Resume
                </a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
