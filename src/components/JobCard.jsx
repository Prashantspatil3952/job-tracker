import { Link } from "react-router-dom";

function JobCard({ job, onDelete }) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <h3>{job.role}</h3>
          <p className="company">{job.company}</p>
        </div>

        <span className={`status ${job.status?.toLowerCase()}`}>
          {job.status}
        </span>
      </div>

      <div className="job-info">
        <p>
          <strong>Location:</strong> {job.location}
        </p>

        <p>
          <strong>Salary:</strong> ₹{job.salary}
        </p>

        <p>
          <strong>Applied:</strong>{" "}
          {job.applicationDate
            ? new Date(job.applicationDate).toLocaleDateString()
            : "N/A"}
        </p>
      </div>

      <div className="job-actions">
        <Link to={`/edit-job/${job._id}`} className="edit-btn">
          Edit
        </Link>

        <button
          onClick={() => onDelete(job._id)}
          className="delete-btn"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default JobCard;