import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="logo">
          AI Job Tracker
        </Link>

        <div className="nav-links">
          {token ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/add-job">Add Job</Link>
              <Link to="/ai-resume-analyzer">
                Resume Analyzer
              </Link>
              <Link to="/job-matcher">
                Job Matcher
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;