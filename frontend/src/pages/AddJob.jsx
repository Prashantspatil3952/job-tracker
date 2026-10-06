import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../services/api";

function AddJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    salary: "",
    status: "Applied",
    applicationDate: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await createJob(formData);

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="form-page">
      <div className="form-card">
        <h1>Add Job Application</h1>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Company</label>

          <input
            type="text"
            name="company"
            placeholder="e.g. Google"
            value={formData.company}
            onChange={handleChange}
            required
          />

          <label>Job Role</label>

          <input
            type="text"
            name="role"
            placeholder="e.g. Full Stack Developer Intern"
            value={formData.role}
            onChange={handleChange}
            required
          />

          <label>Location</label>

          <input
            type="text"
            name="location"
            placeholder="e.g. Pune / Remote"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <label>Salary / Stipend</label>

          <input
            type="number"
            name="salary"
            placeholder="e.g. 45000"
            value={formData.salary}
            onChange={handleChange}
            required
          />

          <label>Status</label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>

          <label>Application Date</label>

          <input
            type="date"
            name="applicationDate"
            value={formData.applicationDate}
            onChange={handleChange}
            required
          />

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Job"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default AddJob;