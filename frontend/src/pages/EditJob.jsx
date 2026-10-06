    import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getJob, updateJob } from "../services/api";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    salary: "",
    status: "Applied",
    applicationDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJob() {
      try {
        const data = await getJob(id);

        const job = data.job || data;

        setFormData({
          company: job.company || "",
          role: job.role || "",
          location: job.location || "",
          salary: job.salary || "",
          status: job.status || "Applied",
          applicationDate: job.applicationDate
            ? job.applicationDate.split("T")[0]
            : "",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [id]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      await updateJob(id, formData);

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="form-page">
        <p className="loading">Loading job...</p>
      </main>
    );
  }

  return (
    <main className="form-page">
      <div className="form-card">
        <h1>Edit Job</h1>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Company</label>

          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
          />

          <label>Job Role</label>

          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          />

          <label>Location</label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <label>Salary / Stipend</label>

          <input
            type="number"
            name="salary"
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
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Job"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default EditJob;