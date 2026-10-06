const Job = require("../models/Job");


// CREATE JOB
async function createJob(req, res) {
  try {
    const {
      company,
      role,
      location,
      salary,
      status,
      applicationDate,
    } = req.body;

    if (
      !company ||
      !role ||
      !location ||
      salary === undefined ||
      !applicationDate
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const job = await Job.create({
      company,
      role,
      location,
      salary,
      status: status || "Applied",
      applicationDate,
      userId: req.user.id,
    });

    return res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Create job error:", error);

    return res.status(500).json({
      message: "Server error while creating job",
    });
  }
}


// GET ALL JOBS
async function getJobs(req, res) {
  try {
    const jobs = await Job.find({
      userId: req.user.id,
    }).sort({
      applicationDate: -1,
    });

    return res.status(200).json({
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error);

    return res.status(500).json({
      message: "Server error while fetching jobs",
    });
  }
}


// GET SINGLE JOB
async function getJob(req, res) {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    return res.status(200).json({
      job,
    });
  } catch (error) {
    console.error("Get job error:", error);

    return res.status(500).json({
      message: "Server error while fetching job",
    });
  }
}


// UPDATE JOB
async function updateJob(req, res) {
  try {
    const {
      company,
      role,
      location,
      salary,
      status,
      applicationDate,
    } = req.body;

    const job = await Job.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      {
        company,
        role,
        location,
        salary,
        status,
        applicationDate,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    return res.status(200).json({
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("Update job error:", error);

    return res.status(500).json({
      message: "Server error while updating job",
    });
  }
}


// DELETE JOB
async function deleteJob(req, res) {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    return res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error);

    return res.status(500).json({
      message: "Server error while deleting job",
    });
  }
}


module.exports = {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
};