const {
  analyzeResumeText,
  matchJobText,
} = require("../services/aiService");

async function analyzeResume(req, res) {
  const { resumeText } = req.body || {};

  if (typeof resumeText !== "string") {
    return res.status(400).json({
      message: "Resume text is required.",
    });
  }

  const text = resumeText.trim();

  if (text.length < 100) {
    return res.status(400).json({
      message: "Resume text must contain at least 100 characters.",
    });
  }

  if (text.length > 15000) {
    return res.status(413).json({
      message: "Resume text cannot exceed 15000 characters.",
    });
  }

  try {
    const result = await analyzeResumeText(text);

    return res.json({ result });
  } catch (error) {
    console.error("Resume analysis failed:", error.message);

    return res.status(error.status || 502).json({
      message:
        error.status === 503
          ? error.message
          : "Resume analysis failed. Check your backend logs and Gemini API setup.",
    });
  }
}

async function matchJobDescription(req, res) {
  const { resumeText, jobDescription } = req.body || {};

  if (
    typeof resumeText !== "string" ||
    typeof jobDescription !== "string"
  ) {
    return res.status(400).json({
      message: "Resume text and job description are required.",
    });
  }

  const resume = resumeText.trim();
  const job = jobDescription.trim();

  if (resume.length < 100) {
    return res.status(400).json({
      message: "Resume text must contain at least 100 characters.",
    });
  }

  if (resume.length > 15000) {
    return res.status(413).json({
      message: "Resume text cannot exceed 15000 characters.",
    });
  }

  if (job.length < 50) {
    return res.status(400).json({
      message:
        "Job description must contain at least 50 characters.",
    });
  }

  if (job.length > 10000) {
    return res.status(413).json({
      message:
        "Job description cannot exceed 10000 characters.",
    });
  }

  try {
    const result = await matchJobText(resume, job);

    return res.json({ result });
  } catch (error) {
    console.error("Job matching failed:", error.message);

    return res.status(error.status || 502).json({
      message:
        error.status === 503
          ? error.message
          : "Job matching failed. Check your backend logs and Gemini API setup.",
    });
  }
}

module.exports = {
  analyzeResume,
  matchJobDescription,
};