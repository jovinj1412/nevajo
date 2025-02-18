import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import logo from "./logo.png"; // Ensure this is the correct path to your logo
import "./App.css"; // Import external CSS file

const LicetAnimation = () => {
  const [fadeOut, setFadeOut] = useState(false);

  const handleNavigation = (e, href) => {
    e.preventDefault();
    setFadeOut(true);
    setTimeout(() => {
      window.location.href = href;
    }, 500);
  };

  return (
    <div className={`container ${fadeOut ? "fade-out" : "fade-in"}`}>
      <img src={logo} alt="Licet" className="logo" />
      <div className="text-content">
        <h1 className="licet">LICET's</h1>
        <Link
          to="/home"
          onClick={(e) => handleNavigation(e, "/home")}
          className="licord"
        >
          Li-cord
        </Link>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LicetAnimation />} />
        <Route path="/home" element={<h2>Welcome to Home Page</h2>} />
      </Routes>
    </Router>
  );
};

export default App;


