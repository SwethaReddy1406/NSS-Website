import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Header() {
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    fetch("/api/statistics")
      .then((response) => response.json())
      .then((data) => setVisits(data.visits))
      .catch((error) => console.error("Visit stats error:", error));
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-logos">
          <img
            src="/RGUKT Logo.png"
            alt="RGUKT Logo"
            className="nss-logo"
          />

          <div className="logo-divider"></div>

          <img
            src="/nsslogo.png"
            alt="NSS Logo"
            className="rgukt-logo"
          />
        </div>

        <div className="header-title">
          <h1>National Service Scheme</h1>
          <h2>RGUKT Basar</h2>
          <p>“Not Me But You”</p>
        </div>

        <div className="header-actions">
          <div className="header-visits">
            <span>👁️</span>
            <div>
              <strong>{visits}</strong>
              <small>Visits</small>
            </div>
          </div>

          <Link to="/login" className="login-btn">
            Login
          </Link>
        </div>
      </header>

      <nav className="nav-menu">
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/units">Units</Link>
       <Link to="/activities">Activities</Link>
       <Link to="/contact">Contact</Link>
      </nav>
    </>
  );
}

export default Header;
