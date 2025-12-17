import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Navbar({ darkMode, setDarkMode }) {
    const location = useLocation();

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [darkMode]);

    return (
    <nav className="navbar custom-navbar sticky-top">
      <div className="container-fluid px-3">

        <div className="d-flex align-items-center justify-content-between w-100">
          <Link className="navbar-brand fw-bold text-white" to="/">
            DOG GALLERY
          </Link>

          <div className="d-flex align-items-center gap-2">


            <button
              className="btn btn-outline-light rounded-pill"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Liked Images */}
            <Link
              to="/likes"
              className={`btn btn-outline-light rounded-pill px-3 d-flex align-items-center gap-1 ${
                location.pathname === "/likes" ? "active-btn" : ""
              }`}
            >
              ❤️
              <span className="d-none d-sm-inline">Liked Images</span>
            </Link>

          </div>
        </div>

      </div>
    </nav>
  );
}


