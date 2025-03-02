"use client";
import { useState, useEffect } from "react";
import { useParams,useRouter} from "next/navigation";

export default function JobDetails() {
  const router =useRouter();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedin: "",
    resume: null,
    skills: "",
    experience: "",
  });

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setJob(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const check=async()=>{
    const token =await  localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
    setShowApplyModal(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("email", formData.email);
    formDataObj.append("linkedin", formData.linkedin);
    formDataObj.append("skills", formData.skills);
    formDataObj.append("experience", formData.experience);
    formDataObj.append("resume", formData.resume);
    formDataObj.append("recruiterId", job.recruiterId);
    formDataObj.append("jobPostId", job.id);

    const response = await fetch("/api/apply", {
      method: "POST",
      body: formDataObj,
    });

    // const resumeTestResponse= await fetch("/api/resumeParse",{
    //   method:"POST",
    //   body: formDataObj,
   
    // });
    // if(resumeTestResponse.ok)
    // {
    //   alert("OOOOOOOOOKKKKKKKKKOOOOKKK")
    // }

    if (response.ok) {
      alert("Application submitted successfully!");
      setShowApplyModal(false);
    } else {
      alert("Failed to submit application.");
    }
  };

  const closeModal = () => setShowApplyModal(false);

  if (loading) return <p className="text-center text-gray-500">Loading job details...</p>;
  if (!job) return <p className="text-center text-red-500">Job not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100">
  {/* Navbar */}
  <nav className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center text-white shadow-lg">
    <h1 className="text-2xl font-bold tracking-wide">🚀 Job Portal</h1>
  </nav>

  {/* Job Details Section */}
  <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
    <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
    <p className="text-lg text-gray-600 mt-2">
      <span className="font-semibold">Company:</span> {job.company}
    </p>
    <p className="text-lg text-gray-600">
      <span className="font-semibold">Posted by:</span> {job.recruiterName}
    </p>
    <p className="text-lg text-gray-600">
      <span className="font-semibold">description</span> {job.description}
    </p>
    <p className="text-lg text-gray-600">
  <span className="font-semibold">Required Skills:</span>
  {job.requiredSkills.map((skill, index) => (
    <span key={index} className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium">
      {skill}
    </span>
  ))}
</p>


    {/* Apply Now Button */}
    <button
      onClick={() => 
          check()}
      className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-md font-semibold text-lg shadow-md hover:scale-105 transition-transform"
    >
      🚀 Apply Now
    </button>
  </div>



      {showApplyModal && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Apply for {job.title}</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
              
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />

              <input
                type="text"
                name="linkedin"
                placeholder="LinkedIn Profile"
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />

              <input
                type="file"
                name="resume"
                accept=".pdf"
                onChange={handleFileChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />

              <input
                type="text"
                name="skills"
                placeholder="Skills (comma-separated)"
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />

              <input
                type="number"
                name="experience"
                placeholder="Experience (in years)"
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />

              <button
                type="submit"
                className="w-full bg-green-500 text-white px-5 py-3 rounded-md font-semibold hover:bg-green-600 transition "
              >
                Submit Application
              </button>
            </form>

            <button 
              onClick={closeModal}
              className="mt-4 text-red-600 font-semibold hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
