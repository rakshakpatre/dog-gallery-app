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


    // return (
    //     <nav className="navbar navbar-expand-lg navbar-dark custom-navbar sticky-top">
    //         <div className="container-fluid px-4">
    //             <Link className="navbar-brand fw-bold fs-4" to="/">
    //                 DOG GALLERY
    //             </Link>

    //             <div className="ms-auto d-flex align-items-center gap-3">
    //                 <button
    //                     className="btn btn-outline-light rounded-pill"
    //                     onClick={() => setDarkMode(!darkMode)}
    //                 >
    //                     {darkMode ? "🌙" : "☀️"}
    //                 </button>
    //                 <Link
    //                     to="/likes"
    //                     className={`btn btn-outline-light px-4 rounded-pill ${location.pathname === "/likes" ? "active-btn" : ""
    //                         }`}
    //                 >
    //                     Liked Images
    //                 </Link>
    //             </div>
    //         </div>
    //     </nav>
    // );

    return (
    <nav className="navbar custom-navbar sticky-top">
      <div className="container-fluid px-3">

        <div className="d-flex align-items-center justify-content-between w-100">

          {/* Left: Logo */}
          <Link className="navbar-brand fw-bold text-white" to="/">
            DOG GALLERY
          </Link>

          {/* Right: Controls (SAME LINE even on mobile) */}
          <div className="d-flex align-items-center gap-2">

            {/* Dark Mode */}
            <button
              className="btn btn-outline-light rounded-pill"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle theme"
            >
              {darkMode ? "🌙" : "☀️"}
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


