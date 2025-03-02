"use client"
import { useState } from "react";

export default function ResumeUploader() {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; // Remove the data type prefix
        setFile(base64String);
      };
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/upload-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file }),
    });

    const data = await response.json();
    setParsedData(data);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h2 className="text-xl font-bold mb-4">Upload Resume</h2>

      <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-4 border p-2 w-full" />

      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">
        {loading ? "Processing..." : "Upload"}
      </button>

      {parsedData && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="text-lg font-bold">Extracted Data</h3>
          <p><strong>Skills:</strong> {parsedData.skills.join(", ")}</p>
          <p><strong>Experience:</strong> {parsedData.experience}</p>
          <p><strong>Education:</strong> {parsedData.education}</p>
        </div>
      )}
    </div>
  );
}
