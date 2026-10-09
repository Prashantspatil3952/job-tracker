import { useState } from "react";
import { analyzeResume } from "../services/api";

function getList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === "string") return item;

      return (
        item?.text ||
        item?.title ||
        item?.message ||
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

function ResultList({ title, items, emptyText }) {
  const list = getList(items);

  return (
    <section className="ai-result-section">
      <h3>{title}</h3>

      {list.length > 0 ? (
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

function AIResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAnalyze(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    const text = resumeText.trim();

    if (text.length < 100) {
      setError(
        "Please enter at least 100 characters from your resume."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await analyzeResume(text);

      setResult(
        response.result ||
        response.analysis ||
        response
      );
    } catch (err) {
      setError(err.message || "Unable to analyze resume.");
    } finally {
      setLoading(false);
    }
  }

  const rawScore =
    result?.score ??
    result?.atsScore ??
    result?.overallScore;

  const score = Number(rawScore);
  const hasScore =
    rawScore !== undefined &&
    rawScore !== null &&
    Number.isFinite(score);

  return (
    <main className="ai-page">
      <header className="ai-page-header">
        <span className="ai-eyebrow">AI CAREER TOOLS</span>
        <h1>AI Resume Analyzer</h1>
        <p>
          Review your resume, identify missing keywords, and
          discover practical ways to improve it before applying.
        </p>
      </header>

      <div className="ai-layout">
        <section className="ai-panel">
          <div className="ai-panel-heading">
            <div>
              <h2>Your resume</h2>
              <p>Paste the text from your current resume below.</p>
            </div>
            <span className="ai-step">01</span>
          </div>

          <form onSubmit={handleAnalyze}>
            <label
              className="ai-field-label"
              htmlFor="resume-text"
            >
              Resume text
            </label>

            <textarea
              id="resume-text"
              className="ai-textarea"
              placeholder={
                "Paste your resume here...\n\n" +
                "Include your summary, skills, education, " +
                "experience, projects, and achievements."
              }
              value={resumeText}
              onChange={(event) =>
                setResumeText(event.target.value)
              }
              rows={15}
              minLength={100}
              required
            />

            <div className="ai-input-footer">
              <span>
                {resumeText.trim().length} characters
              </span>
              <span>Minimum 100 characters</span>
            </div>

            {error && (
              <div className="ai-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="ai-primary-btn"
              disabled={loading}
            >
              {loading
                ? "Analyzing resume..."
                : "Analyze My Resume"}
            </button>
          </form>

          <p className="ai-privacy-note">
            Review the result carefully before making changes to
            your resume. Never include passwords or sensitive
            account information.
          </p>
        </section>

        <section className="ai-panel ai-results-panel">
          <div className="ai-panel-heading">
            <div>
              <h2>Analysis results</h2>
              <p>Your resume feedback will appear here.</p>
            </div>
            <span className="ai-step">02</span>
          </div>

          {!result && !loading && (
            <div className="ai-empty-result">
              <div className="ai-empty-icon">✦</div>
              <h3>Ready to review your resume?</h3>
              <p>
                Submit your resume text to receive its score,
                strengths, improvement areas, and keyword tips.
              </p>
            </div>
          )}

          {loading && (
            <div className="ai-loading">
              <span className="ai-spinner" />
              <p>Reviewing your resume...</p>
            </div>
          )}

          {result && (
            <div className="ai-result-content">
              {hasScore && (
                <div className="ai-score-card">
                  <div>
                    <span className="ai-score-label">
                      Resume score
                    </span>
                    <p>Based on the analysis response</p>
                  </div>

                  <strong>
                    {Math.max(0, Math.min(100, score))}
                    <small>/100</small>
                  </strong>
                </div>
              )}

              <section className="ai-result-section">
                <h3>Summary</h3>
                <p className="ai-summary-text">
                  {result.summary ||
                    result.overview ||
                    "The analysis completed, but no summary was returned."}
                </p>
              </section>

              <ResultList
                title="Strengths"
                items={result.strengths}
                emptyText="No strengths were returned."
              />

              <ResultList
                title="Areas to improve"
                items={
                  result.weaknesses ||
                  result.areasToImprove
                }
                emptyText="No improvement areas were returned."
              />

              <ResultList
                title="Missing keywords"
                items={
                  result.missingKeywords ||
                  result.missing_keywords
                }
                emptyText="No missing keywords were returned."
              />

              <ResultList
                title="Recommended improvements"
                items={
                  result.improvements ||
                  result.recommendations
                }
                emptyText="No recommendations were returned."
              />

              <ResultList
                title="ATS tips"
                items={
                  result.atsTips ||
                  result.atsRecommendations
                }
                emptyText="No ATS tips were returned."
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AIResumeAnalyzer;