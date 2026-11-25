
import { useEffect } from "react";

import Header from "../components/Header";
import VisitorStats from "../components/VisitorStats";
import NotificationBar from "../components/NotificationBar";
import Footer from "../components/Footer";
const navigationEntry = performance.getEntriesByType("navigation")[0];
const isDocumentRefresh = navigationEntry?.type === "reload";

let visitCountedInDocument = false;
function Home() {
  // Record homepage visit only on initial website entry or refresh
  useEffect(() => {
    const navigationEntry = performance.getEntriesByType("navigation")[0];
    const isRefresh = navigationEntry?.type === "reload";

    const alreadyVisited = sessionStorage.getItem("nss_home_visited");

    // Do not count internal page navigation
    if (alreadyVisited && !isRefresh) {
      return;
    }

    sessionStorage.setItem("nss_home_visited", "true");

    async function recordVisit() {
      try {
        const csrfResponse = await fetch("/api/auth/csrf", {
          credentials: "include",
        });

        if (!csrfResponse.ok) {
          throw new Error("Unable to obtain CSRF token");
        }

        const csrfData = await csrfResponse.json();

        const response = await fetch("/api/statistics/visit", {
          method: "POST",
          credentials: "include",
          headers: {
            "X-XSRF-TOKEN": csrfData.token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to record homepage visit");
        }
      } catch (err) {
        console.error("Visit counter error:", err);
      }
    }

    recordVisit();
  }, []);

  return (
    <div className="website">
      <Header />

      <div className="main-layout">
        <main className="content">

          {/* HERO SECTION */}
          <section className="hero-section">
            <video
              className="hero-video"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/Nss_Intro.mp4" type="video/mp4" />
            </video>

            <div className="hero-overlay"></div>

            <div className="hero-content">
              <p className="hero-title">NSS</p>

              <h1 className="hero-motto">
                Not Me, But You
              </h1>

              <p className="hero-description">
                Empowering students through service, leadership,
                and meaningful contribution to society.
              </p>
            </div>
          </section>

          {/* NSS IMPACT STATISTICS */}
          <VisitorStats />

          {/* NOTIFICATIONS */}
          <NotificationBar />

          {/* NSS IMPACT */}
          <section className="nss-impact">
            <div className="impact-heading">
              <p>OUR IMPACT</p>

              <h2>Making a Difference Through Service</h2>

              <span>
                Small actions by students can create meaningful change
                in our communities and environment.
              </span>
            </div>

            <div className="impact-grid">
              <div className="impact-card">
                <div className="impact-icon">🌱</div>
                <h3>Environment</h3>
                <p>
                  Promoting sustainability, environmental awareness
                  and responsible use of natural resources.
                </p>
              </div>

              <div className="impact-card">
                <div className="impact-icon">🤝</div>
                <h3>Community</h3>
                <p>
                  Working with communities through meaningful
                  service and social welfare initiatives.
                </p>
              </div>

              <div className="impact-card">
                <div className="impact-icon">🎯</div>
                <h3>Leadership</h3>
                <p>
                  Encouraging students to develop leadership,
                  empathy and social responsibility.
                </p>
              </div>
            </div>
          </section>

          {/* JOIN NSS CTA */}
          <section className="join-nss">
            <div className="join-nss-content">
              <p className="join-label">
                BE A PART OF THE CHANGE
              </p>

              <h2>Ready to Make a Difference?</h2>

              <p>
                Join NSS and become part of a community of students
                working together to serve society and create positive change.
              </p>

              <button
                className="join-btn"
                onClick={() => window.location.href = "/register"}
              >
                Join NSS
              </button>
            </div>
          </section>

          {/* NSS & COMMUNITY INITIATIVES */}
          <section className="initiative-section">
            <h2>Our Affiliations & Initiatives</h2>

            <div className="initiative-logos">
              <div className="initiative-logo">
                <img
                  src="/1024px-Ministry_of_Youth_Affairs_and_Sports.png"
                  alt="Ministry of Youth Affairs and Sports"
                />
              </div>

              <div className="initiative-logo">
                <img
                  src="/my-bharat-logo-png_seeklogo-677239.png"
                  alt="My Bharat"
                />
              </div>

              <div className="initiative-logo">
                <img
                  src="/Election-commission-L.png"
                  alt="Election Commission"
                />
              </div>

              <div className="initiative-logo">
                <img
                  src="/sdg-logo-removebg-preview.png"
                  alt="Sustainable Development Goals"
                />
              </div>

              <div className="initiative-logo">
                <img
                  src="/logo 5.png"
                  alt="NSS initiative"
                />
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default Home;

