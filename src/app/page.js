"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [role,setRole] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      setRole(userRole);

      // Redirect based on role
      if (userRole === "recruiter") {
        router.push("/Recruiter")
      } else {
        router.push("/");
      }
    }
    setIsLoggedIn(!!token);
  }, [router]);


  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  const handleLogin = () => {
    router.push("/login"); // Redirect to login page
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    setIsLoggedIn(false);
    router.push("/"); // Redirect to home after logout
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 font-sans">
      {/* Navbar */}
      <nav className="bg-blue-700 p-4 flex justify-between items-center text-white shadow-lg">
      <h1 className="text-2xl font-bold tracking-wide">🚀 Job Portal</h1>
      
      {isLoggedIn ? (
  <button
    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
    onClick={handleLogout}
  >
    Logout
  </button>
) : (
  <div className="flex space-x-4">
    <button
      className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition duration-300"
      onClick={handleLogin}
    >
      Login
    </button>
    <button
      className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300"
      onClick={() => router.push("/signup")}
    >
      Sign Up
    </button>
  </div>
)}
    </nav>
      {/* Job Listings */}
      <div className="max-w-5xl mx-auto mt-8 p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">✨ Available Jobs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <Link key={job.id} href={`/job/${job.id}`} className="no-underline">
              <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-blue-500 cursor-pointer">
                <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                <p className="text-gray-600">{job.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
