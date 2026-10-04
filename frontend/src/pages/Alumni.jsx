import React from "react";
import "../styles/alumni.css";

const alumniData = [
  {
    name: "Shiva Balaji",
    batch: "2017",
    role: "Student Advisor",
    linkedin: "https://www.linkedin.com/"
  },
   {
    name: "VV Krishna",
    batch: "2017",
    role: "Student Advisor",
    linkedin: "https://www.linkedin.com/"
  },
  {
    name: "Rachana Macha",
    batch: "2018",
    role: "Student Advisor",
    linkedin: "https://www.linkedin.com/"
  },
   {
    name: "Mani Yadav",
    batch: "2018",
    role: "Student Advisor",
    linkedin: "https://www.linkedin.com/"
  },
  {
    name: "Vijay Yadav Patloor",
    batch: "2020",
    role: "Student Advisor",
    linkedin: "https://www.linkedin.com/"
  },
  {
    name: "Mahaboob Kakarada",
    batch: "2020",
    role: "Student Advisor",
    linkedin: "https://www.linkedin.com/"
  },
];

function Alumni() {
  return (
    <main className="alumni-page">


      {/* =====================================================
          INTRODUCTION
      ===================================================== */}
      <section className="alumni-introduction">

        <div className="alumni-intro-text">

          <p className="alumni-section-label">
            NSS ALUMNI COMMUNITY
          </p>

          <h2>
            Once an NSS Volunteer,
            <br />
            Always a Volunteer
          </h2>

          <p>
            NSS creates experiences that stay with volunteers long
            after their college years. Our alumni carry forward the
            values of service, empathy, leadership and responsibility
            into their professional and personal lives.
          </p>

          <p>
            This alumni community brings together former volunteers
            who continue to stay connected with the spirit of NSS
            and contribute to society in different ways.
          </p>

        </div>

      </section>


      {/* =====================================================
          ALUMNI MEMBERS
      ===================================================== */}
      <section className="alumni-members">

        <div className="alumni-heading">

          <p className="alumni-section-label">
            OUR ALUMNI
          </p>

          <h2>Meet Our Alumni</h2>

          <p>
            Celebrating the volunteers who continue to carry the
            values of NSS beyond their time at RGUKT Basar.
          </p>

        </div>


        <div className="alumni-grid">

          {alumniData.map((alumni, index) => (

            <article
              className="alumni-card"
              key={index}
            >

              <div className="alumni-profile-image">
                <span>
                  {alumni.name.charAt(0)}
                </span>
              </div>

              <div className="alumni-card-content">

                <span className="alumni-batch">
                  BATCH {alumni.batch}
                </span>

                <h3>
                  {alumni.name}
                </h3>

                <p className="alumni-role">
                  {alumni.role}
                </p>

                <p className="alumni-description">
                  {alumni.description}
                </p>

                <a
                  href={alumni.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="alumni-linkedin"
                >
                  LinkedIn ↗
                </a>

              </div>

            </article>

          ))}

        </div>

      </section>


      {/* =====================================================
          CLOSING
      ===================================================== */}
      <section className="alumni-closing">

        <p className="alumni-section-label">
          NOT ME BUT YOU
        </p>

        <h2>
          The Spirit of Service
          <br />
          Lives On.
        </h2>

        <p>
          From campus volunteers to lifelong contributors,
          the NSS journey continues through every generation.
        </p>

      </section>

    </main>
  );
}

export default Alumni;
