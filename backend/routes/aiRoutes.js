const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  analyzeResume,
  matchJobDescription,
} = require("../controllers/aiController");

const router = express.Router();

// Resume Analyzer — login required
router.post(
  "/resume/analyze",
  authMiddleware,
  analyzeResume
);

// Job Matcher — login required
router.post(
  "/job-match",
  authMiddleware,
  matchJobDescription
);

module.exports = router;