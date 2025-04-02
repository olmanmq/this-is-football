import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/images/logo3.png"; // Import the logo image

const Layout = ({ children }) => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          {/* Logo */}
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src={logo}
              alt="Football Vite Logo"
              style={{ width: "100px", height: "100px", marginRight: "10px" }} // Adjust size as needed
            />
            Football Vite
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/teams">
                  Teams
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/matches">
                  Matches
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/statistics">
                  Statistics
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Standings">
                  Standings
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-4">{children}</div>
    </div>
  );
};

export default Layout;