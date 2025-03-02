"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
    company: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setLoading(false);

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      
      // Redirect based on role" : "/");
      router.push(data.role === "recruiter" ? "/Recruiter" : "/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-4 text-black" >Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"/>

          <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"/>

          <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"/>

          <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded-md text-black">
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>

          {formData.role === "recruiter" && (
            <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company Name (For Recruiters)"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" />
          )}

          <button type="submit" disabled={loading}
            className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300">
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
