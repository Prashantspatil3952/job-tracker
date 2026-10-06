import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import JobCard from "../components/JobCard";
import { getJobs, deleteJob } from "../services/api";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadJobs() {
    try {
      setLoading(true);

      const data = await getJobs();

      setJobs(data.jobs || data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteJob(id);

      setJobs((currentJobs) =>
        currentJobs.filter((job) => job._id !== id)
      );
    } catch (error) {
      alert(error.message);
    }
  }

  const total = jobs.length;

  const applied = jobs.filter(
    (job) => job.status === "Applied"
  ).length;

  const interviews = jobs.filter(
    (job) => job.status === "Interview"
  ).length;

  const selected = jobs.filter(
    (job) => job.status === "Selected"
  ).length;

  const rejected = jobs.filter(
    (job) => job.status === "Rejected"
  ).length;

  return (
    <main className="container">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Track your job applications.</p>
        </div>

        <Link to="/add-job" className="primary-btn">
          + Add Job
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Applications</h3>
          <strong>{total}</strong>
        </div>

        <div className="stat-card">
          <h3>Applied</h3>
          <strong>{applied}</strong>
        </div>

        <div className="stat-card">
          <h3>Interviews</h3>
          <strong>{interviews}</strong>
        </div>

        <div className="stat-card">
          <h3>Selected</h3>
          <strong>{selected}</strong>
        </div>

        <div className="stat-card">
          <h3>Rejected</h3>
          <strong>{rejected}</strong>
        </div>
      </div>

      <section className="jobs-section">
        <div className="section-header">
          <h2>My Applications</h2>
        </div>

        {loading && (
          <p className="loading">Loading applications...</p>
        )}

        {error && <div className="error">{error}</div>}

        {!loading && !error && jobs.length === 0 && (
          <div className="empty-state">
            <h3>No applications yet</h3>

            <p>
              Start tracking your job applications by adding your
              first job.
            </p>

            <Link to="/add-job" className="primary-btn">
              Add Your First Job
            </Link>
          </div>
        )}

        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;