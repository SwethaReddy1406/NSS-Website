function Header() {
  return (
    <header className="header">

      {/* LEFT — INSTITUTION LOGOS */}
      <div className="header-logos">
        <img
          src="RGUKT Logo.png"
          alt="National Service Scheme"
          className="nss-logo"
        />

        <div className="logo-divider"></div>

        <img
          src="nsslogo.png"
          alt="RGUKT Basar"
          className="rgukt-logo"
        />
      </div>


      {/* CENTER — NSS TITLE */}
      <div className="header-title">
        <h1>National Service Scheme</h1>
        <h2>RGUKT Basar</h2>
        <p>“Not Me But You”</p>
      </div>


      {/* RIGHT — WEBSITE INFORMATION */}
      <div className="header-actions">

        <div className="stat">
          <span>👁</span>
          <div>
            <strong>1,245</strong>
            <small>Views</small>
          </div>
        </div>

        <div className="stat">
          <span>👥</span>
          <div>
            <strong>856</strong>
            <small>Visitors</small>
          </div>
        </div>

        <button className="login-btn">
          Login
        </button>

      </div>

    </header>
  );
}

export default Header;
