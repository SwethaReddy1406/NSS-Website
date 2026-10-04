import React, { useEffect, useState } from "react";
import activitiesData from "../activitiesData";
import "../styles/activities.css";

const verticals = [
  {
    name: "Sustainable Development & Environment",
  },
  {
    name: "Community Service & Social Responsibility",
  },
  {
    name: "Skill Development & Capacity Building",
  },
  {
    name: "Awareness & Social Outreach",
  },
  {
    name: "Youth & Nation Building",
  },
  {
    name: "Health, Well-being & Lifestyle",
  },
  {
    name: "Events, Collaboration & Special Initiatives",
  },
];

function ActivityGalleryCard({ activity }) {
  const [currentImage, setCurrentImage] = useState(0);

  const images =
    activity.images && activity.images.length > 0
      ? activity.images
      : [];

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImage((previous) => {
        return (previous + 1) % images.length;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [images.length]);

  const nextImage = () => {
    if (images.length === 0) return;

    setCurrentImage(
      (previous) => (previous + 1) % images.length
    );
  };

  const previousImage = () => {
    if (images.length === 0) return;

    setCurrentImage(
      (previous) =>
        (previous - 1 + images.length) % images.length
    );
  };

  const goToImage = (index) => {
    setCurrentImage(index);
  };

  return (
    <article className="gallery-card">

      {/* ================= IMAGE SLIDER ================= */}

      <div className="gallery-image">

        {images.length > 0 ? (
          <img
            key={images[currentImage]}
            src={images[currentImage]}
            alt={`${activity.title} - Photo ${
              currentImage + 1
            }`}
          />
        ) : (
          <div className="gallery-no-image">
            No images added yet
          </div>
        )}

        {/* Image overlay */}

        <div className="gallery-overlay">
          <span>{activity.date}</span>
        </div>

        {/* Previous / Next */}

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="gallery-arrow gallery-prev"
              onClick={previousImage}
              aria-label="Previous image"
            >
              &#10094;
            </button>

            <button
              type="button"
              className="gallery-arrow gallery-next"
              onClick={nextImage}
              aria-label="Next image"
            >
              &#10095;
            </button>
          </>
        )}

        {/* Image counter */}

        {images.length > 1 && (
          <div className="gallery-counter">
            {currentImage + 1} / {images.length}
          </div>
        )}

        {/* Dots */}

        {images.length > 1 && (
          <div className="gallery-dots">
            {images.map((_, index) => (
              <button
                type="button"
                key={index}
                className={`gallery-dot ${
                  currentImage === index ? "active" : ""
                }`}
                onClick={() => goToImage(index)}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}

      </div>

      {/* ================= ACTIVITY INFORMATION ================= */}

      <div className="gallery-content">

        <span className="gallery-vertical">
          {activity.vertical}
        </span>

        <h3>{activity.title}</h3>

        <div className="gallery-meta">
          <span>{activity.hours} hrs</span>
          <span>{images.length} photos</span>
        </div>

      </div>

    </article>
  );
}

function Activities() {

  const totalHours = activitiesData.reduce(
    (total, activity) => total + activity.hours,
    0
  );

  const getVerticalActivities = (verticalName) => {
    return activitiesData.filter(
      (activity) => activity.vertical === verticalName
    );
  };

  const getVerticalHours = (verticalName) => {
    return getVerticalActivities(verticalName).reduce(
      (total, activity) => total + activity.hours,
      0
    );
  };

  return (
    <div className="activities-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="activities-hero">

        <div className="hero-content">

          <span className="hero-label">
            NSS • RGUKT BASAR
          </span>

          <h1>
            Activities &
            <br />
            Events
          </h1>

          <p className="hero-subtitle">
            Academic Year 2024–25
          </p>

          <h4>
            One year in action - One Spirit of Service
          </h4>

          <p className="hero-description">
            From environmental responsibility and community
            service to youth leadership, awareness and
            well-being, NSS volunteers of RGUKT Basar turned
            participation into meaningful action.
          </p>

        </div>

        <div className="hero-image">

          <img
            src="IMG-20250712-WA0035.jpg"
            alt="NSS community service"
          />

          <div className="hero-overlay"></div>

          <div className="hero-image-caption">

            <span>NOT ME BUT YOU</span>

            <small>
              Service • Responsibility • Community
            </small>

          </div>

        </div>

      </section>


      {/* =====================================================
          OUR YEAR IN ACTION
      ===================================================== */}

      <section className="activities-intro">

        <span className="section-kicker">
          OUR YEAR IN ACTION
        </span>

        <h2>
          One spirit of service.
        </h2>

      </section>


      {/* =====================================================
          VOLUNTEER ENGAGEMENT
      ===================================================== */}

      <section className="engagement-section">

        <div className="section-heading">

          <span className="section-kicker">
            01 • VOLUNTEER ENGAGEMENT
          </span>

          <h2>
            Hours of participation
          </h2>

          <p>
            The recorded activities represent {totalHours} hours
            of participation across seven NSS service verticals.
          </p>

        </div>


        <div className="engagement-summary">

          <div className="hours-highlight">

            <span>
              TOTAL VOLUNTEER ENGAGEMENT
            </span>

            <strong>
              {totalHours}
            </strong>

            <small>
              hours
            </small>

          </div>


          <div className="hours-breakdown">

            {verticals.map((vertical) => {

              const hours =
                getVerticalHours(vertical.name);

              const percentage =
                totalHours === 0
                  ? 0
                  : (hours / totalHours) * 100;

              return (
                <div
                  className="hours-row"
                  key={vertical.name}
                >

                  <div className="hours-row-top">

                    <span>
                      {vertical.name}
                    </span>

                    <strong>
                      {hours} hrs
                    </strong>

                  </div>

                  <div className="hours-track">

                    <div
                      className="hours-fill"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          ACTIVITY RECORD
      ===================================================== */}

      <section className="matrix-section">

        <div className="section-heading">

          <span className="section-kicker">
            02 • ACTIVITY RECORD
          </span>

          <h2>
            Activities at a glance
          </h2>

          <p>
            A chronological view of NSS activities conducted
            during Academic Year 2024–25.
          </p>

        </div>


        <div className="activity-table-wrapper">

          <table className="activity-table">

            <thead>

              <tr>
                <th>Date</th>
                <th>Activity</th>
                <th>Service Vertical</th>
                <th>Objective</th>
                <th>Impact</th>
              </tr>

            </thead>


            <tbody>

              {activitiesData.map((activity) => (

                <tr key={activity.id}>

                  <td className="table-date">
                    {activity.date}
                  </td>

                  <td className="activity-name">
                    {activity.title}
                  </td>

                  <td>
                    <span className="table-vertical">
                      {activity.vertical}
                    </span>
                  </td>

                  <td>
                    {activity.objective}
                  </td>

                  <td>
                    {activity.impact}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>


      {/* =====================================================
          NSS GALLERY
      ===================================================== */}

      <section className="gallery-section">

        <div className="section-heading">

          <span className="section-kicker">
            03 • NSS GALLERY
          </span>

          <h2>
            Moments of Service
          </h2>

          <p>
            A visual journey through NSS activities, volunteer
            participation and moments of service during
            Academic Year 2024–25.
          </p>

        </div>


        <div className="gallery-grid">

          {activitiesData.map((activity) => (

            <ActivityGalleryCard
              key={activity.id}
              activity={activity}
            />

          ))}

        </div>

      </section>

    </div>
  );
}

export default Activities;
