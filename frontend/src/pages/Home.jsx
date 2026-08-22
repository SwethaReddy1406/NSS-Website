import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VisitorStats from "../components/VisitorStats";
import NotificationBar from "../components/NotificationBar";
import ActivityCard from "../components/ActivityCard";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="website">

      <Header />

      <div className="main-layout">

        <Sidebar />

        <main className="content">

          {/* =====================================================
              HERO SECTION
          ===================================================== */}

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

              <p className="hero-title">
                NSS
              </p>

              <h1 className="hero-motto">
                Not Me, But You
              </h1>

              <p className="hero-description">
                Empowering students through service, leadership,
                and meaningful contribution to society.
              </p>
            </div>

          </section>


          {/* =====================================================
              NSS IMPACT STATISTICS
          ===================================================== */}

          <VisitorStats />


          {/* =====================================================
              NOTIFICATIONS
          ===================================================== */}

          <NotificationBar />


          {/* =====================================================
              RECENT ACTIVITIES
          ===================================================== */}

          <section className="recent-activities">

            <div className="section-title">
              <h2>Recent Activities</h2>
            </div>

            <div className="activity-grid">

              <ActivityCard
                images={[
                  "/IMG-20250819-WA0021.jpg",
                  "/IMG-20250504-WA0020.jpg",
                  "/IMG-20240211-WA0014.jpg"
                ]}
                title="SDGs & Nature"
                description="NSS volunteers participating in activities promoting sustainable development and environmental responsibility."
              />

              <ActivityCard
                images={[
                  "/IMG-20250819-WA0002.jpg",
                  "/IMG-20250819-WA0009.jpg",
                  "/IMG-20250712-WA0035.jpg"
                ]}
                title=" Student Skill Development Activities"
                description="Volunteers working with the community through meaningful service and social welfare activities."
              />

              <ActivityCard
                images={[
                  "/IMG-20250310-WA0018.jpg",
                  "/IMG-20250310-WA0010.jpg",
                  "/IMG-20250311-WA0029.jpg"
                ]}
                title="Community Service and Camps"
                description="NSS volunteers contributing to special camps and service programmes for the community."
              />

            </div>

            <div className="activities-link">
              <a href="/activities">
                View All Activities →
              </a>
            </div>

          </section>
          
          {/* =====================================================
    NSS IMPACT
===================================================== */}

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

{/* =====================================================
    JOIN NSS CTA
===================================================== */}

<section className="join-nss">

  <div className="join-nss-content">

    <p className="join-label">
      BE A PART OF THE CHANGE
    </p>

    <h2>
      Ready to Make a Difference?
    </h2>

    <p>
      Join NSS and become part of a community of students
      working together to serve society and create positive change.
    </p>

    <button className="join-btn">
      Join NSS
    </button>

  </div>

</section>


{/* =====================================================
    NSS & COMMUNITY INITIATIVES
===================================================== */}

<section className="initiative-section">

  <h2>Our Affiliations & Initiatives</h2>

  <div className="initiative-logos">

    <div className="initiative-logo">
      <img src="/1024px-Ministry_of_Youth_Affairs_and_Sports.png" />
    </div>

    <div className="initiative-logo">
      <img src="/my-bharat-logo-png_seeklogo-677239.png"  />
    </div>

    <div className="initiative-logo">
      <img src="/Election-commission-L.png" />
    </div>

    <div className="initiative-logo">
      <img src="sdg-logo-removebg-preview.png"  />
    </div>

    <div className="initiative-logo">
      <img src="/logo 5.png"  />
    </div>

  </div>

</section>

        </main>

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

    </div>
  );
}

export default Home;
