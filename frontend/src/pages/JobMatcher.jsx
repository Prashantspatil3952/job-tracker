import { useState } from "react";
import { matchJobDescription } from "../services/api";

function toList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === "string") return item;

      return (
        item?.text ||
        item?.name ||
        item?.title ||
        JSON.stringify(item)
      );
    });
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function MatchList({ title, items, emptyText }) {
  const list = toList(items);

  return (
    <section className="ai-result-section">
      <h3>{title}</h3>

      {list.length ? (
        <ul className="ai-result-list">
          {list.map((item, index) => (
            <li key={`${title}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="ai-muted">{emptyText}</p>
      )}
    </section>
  );
}

function JobMatcher() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleMatch(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    const resume = resumeText.trim();
    const description = jobDescription.trim();

    if (resume.length < 100) {
      setError(
        "Please enter at least 100 characters from your resume."
      );
      return;
    }

    if (description.length < 50) {
      setError(
        "Please enter a job description of at least 50 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await matchJobDescription(
        resume,
        description
      );

      setResult(
        response.result ||
        response.match ||
        response
      );
    } catch (err) {
      setError(
        err.message || "Unable to match this job description."
      );
    } finally {
      setLoading(false);
    }
  }

  const rawScore =
    result?.matchScore ??
    result?.score ??
    result?.matchPercentage;

  const score = Number(rawScore);
  const hasScore =
    rawScore !== undefined &&
    rawScore !== null &&
    Number.isFinite(score);

  const safeScore = hasScore
    ? Math.max(0, Math.min(100, score))
    : 0;

  return (
    <main className="ai-page">
      <header className="ai-page-header">
        <span className="ai-eyebrow">AI CAREER TOOLS</span>
        <h1>Job Description Matcher</h1>
        <p>
          Compare your resume with a job posting to understand
          your relevant skills, gaps, and next steps.
        </p>
      </header>

      <form onSubmit={handleMatch}>
        <div className="ai-match-grid">
          <section className="ai-panel">
            <div className="ai-panel-heading">
              <div>
                <h2>Your resume</h2>
                <p>Use the resume you plan to submit.</p>
              </div>
              <span className="ai-step">01</span>
            </div>

            <label
              className="ai-field-label"
              htmlFor="matcher-resume"
            >
              Resume text
            </label>

            <textarea
              id="matcher-resume"
              className="ai-textarea"
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(event) =>
                setResumeText(event.target.value)
              }
              rows={13}
              required
            />

            <div className="ai-input-footer">
              <span>
                {resumeText.trim().length} characters
              </span>
              <span>Minimum 100</span>
            </div>
          </section>

          <section className="ai-panel">
            <div className="ai-panel-heading">
              <div>
                <h2>Job description</h2>
                <p>Paste the requirements from the job posting.</p>
              </div>
              <span className="ai-step">02</span>
            </div>

            <label
              className="ai-field-label"
              htmlFor="job-description"
            >
              Job description
            </label>

            <textarea
              id="job-description"
              className="ai-textarea"
              placeholder="Paste the job title, responsibilities, required skills, qualifications, and experience..."
              value={jobDescription}
              onChange={(event) =>
                setJobDescription(event.target.value)
              }
              rows={13}
              required
            />

            <div className="ai-input-footer">
              <span>
                {jobDescription.trim().length} characters
              </span>
              <span>Minimum 50</span>
            </div>
          </section>
        </div>

        {error && (
          <div className="ai-error" role="alert">
            {error}
          </div>
        )}

        <div className="ai-form-actions">
          <button
            type="submit"
            className="ai-primary-btn"
            disabled={loading}
          >
            {loading
              ? "Comparing resume and job..."
              : "Match My Resume"}
          </button>
        </div>
      </form>

      {loading && (
        <section className="ai-panel ai-loading-panel">
          <span className="ai-spinner" />
          <p>Comparing skills and job requirements...</p>
        </section>
      )}

      {result && (
        <section className="ai-panel ai-match-results">
          <div className="ai-panel-heading">
            <div>
              <h2>Match results</h2>
              <p>
                Use this comparison to target your application.
              </p>
            </div>
            <span className="ai-step">03</span>
          </div>

          {hasScore && (
            <div className="ai-score-card ai-match-score-card">
              <div>
                <span className="ai-score-label">
                  Job match score
                </span>
                <p>
                  A guide to alignment, not a hiring guarantee.
                </p>
              </div>

              <strong>
                {safeScore}
                <small>%</small>
              </strong>

              <div
                className="ai-score-track"
                role="progressbar"
                aria-label="Job match score"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={safeScore}
              >
                <span style={{ width: `${safeScore}%` }} />
              </div>
            </div>
          )}

          <section className="ai-result-section">
            <h3>Match summary</h3>
            <p className="ai-summary-text">
              {result.summary ||
                result.overview ||
                "The comparison completed, but no summary was returned."}
            </p>
          </section>

          <div className="ai-results-grid">
            <MatchList
              title="Matched skills"
              items={
                result.matchedSkills ||
                result.matchedKeywords
              }
              emptyText="No matched skills were returned."
            />

            <MatchList
              title="Missing skills"
              items={
                result.missingSkills ||
                result.missingKeywords
              }
              emptyText="No missing skills were returned."
            />
          </div>

          {result.experienceFit && (
            <section className="ai-result-section">
              <h3>Experience alignment</h3>
              <p className="ai-summary-text">
                {typeof result.experienceFit === "string"
                  ? result.experienceFit
                  : JSON.stringify(result.experienceFit)}
              </p>
            </section>
          )}

          <MatchList
            title="Recommendations"
            items={
              result.recommendations ||
              result.improvements
            }
            emptyText="No recommendations were returned."
          />
        </section>
      )}
    </main>
  );
}

export default JobMatcher;