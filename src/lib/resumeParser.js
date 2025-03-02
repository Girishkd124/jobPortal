import pdfParse from "pdf-parse";

/**
 * Parses a PDF resume file and extracts text.
 * @param {File} resumeFile - The uploaded resume file (from FormData).
 * @returns {Promise<string>} Extracted text from the resume.
 */
export async function parseResumeFromFile(resumeFile) {
  try {
    if (!resumeFile) {
      throw new Error("No resume file provided.");
    }

    // Convert File object to ArrayBuffer
    const arrayBuffer = await resumeFile.arrayBuffer();

    // Convert ArrayBuffer to Buffer
    const pdfBuffer = Buffer.from(arrayBuffer);

    // Parse PDF text
    const parsedData = await pdfParse(pdfBuffer);
    
    return parsedData.text;
  } catch (error) {
    console.error("Resume Parsing Error:", error);
    throw new Error("Failed to parse resume.");
  }
}
