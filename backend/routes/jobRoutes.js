    const express = require("express");

const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// All job routes require authentication

router.get("/", authMiddleware, getJobs);

router.get("/:id", authMiddleware, getJob);

router.post("/", authMiddleware, createJob);

router.put("/:id", authMiddleware, updateJob);

router.delete("/:id", authMiddleware, deleteJob);


module.exports = router;