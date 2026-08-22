import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>

        <Link to="/">Home</Link>

        <Link to="/about">About Us</Link>

        <Link to="/activities">Activities / Events</Link>

        <Link to="/units">Units</Link>

        <Link to="/login">Login / Register</Link>

        <Link to="/contact">Contact Us</Link>

      </nav>
    </aside>
  );
}

export default Sidebar;
