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
        <nav className="navbar navbar-expand-lg navbar-dark custom-navbar sticky-top">
            <div className="container-fluid px-4">
                <Link className="navbar-brand fw-bold fs-4" to="/">
                    DOG GALLERY
                </Link>

                <div className="ms-auto d-flex align-items-center gap-3">
                    <button
                        className="btn btn-outline-light rounded-pill"
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        {darkMode ? "🌙" : "☀️"}
                    </button>
                    <Link
                        to="/likes"
                        className={`btn btn-outline-light px-4 rounded-pill ${location.pathname === "/likes" ? "active-btn" : ""
                            }`}
                    >
                        Liked Images
                    </Link>
                </div>
            </div>
        </nav>
    );
}


