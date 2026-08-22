function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-column">

          <h3>Explore</h3>

          <a href="/">Home</a>
          <a href="/about">About Us</a>
          <a href="/activities">Activities / Events</a>
          <a href="/units">NSS Units</a>
          <a href="/contact">Contact Us</a>

        </div>


        <div className="footer-column">

          <h3>Important Links</h3>

          <a
            href="https://nss.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
          >
            NSS India
          </a>

          <a
            href="https://mybharat.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
          >
            MY Bharat
          </a>

          <a
            href="https://www.rgukt.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
          >
            RGUKT Basar
          </a>

        </div>

      </div>


      <div className="footer-bottom">

        <div className="footer-bottom-links">

          <a href="/privacy">
            Privacy Policy
          </a>

          <a href="/disclaimer">
            Disclaimer
          </a>

          <a href="/website-policies">
            Website Policies
          </a>

          <a href="/sitemap">
            Sitemap
          </a>

        </div>

        <p>
          © 2026 NSS RGUKT Basar. All Rights Reserved.
        </p>

        <p>
          Website maintained by NSS Unit, RGUKT Basar.
        </p>

      </div>

    </footer>
  );
}

export default Footer;
