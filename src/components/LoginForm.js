"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("candidate"); // Default role: Candidate
  const router = useRouter(); // Initialize router

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem("token", data.token); // Store token
      router.push("/"); // Redirect to main page
    } else {
      alert(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="candidate">Candidate</option>
        <option value="recruiter">Recruiter</option>
      </select>
      <button type="submit">Login</button>
    </form>
  );
}
