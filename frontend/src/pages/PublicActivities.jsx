import { apiFetch } from "../api.js";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ActivityCard from "../components/ActivityCard";
import "./PublicActivities.css";

function PublicActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const response = await apiFetch("/api/activities");

        if (!response.ok) {
          throw new Error("Failed to load activities");
        }

        const data = await response.json();

        // Show only published activities
        const publishedActivities = data.filter(
          (activity) => activity.status === "PUBLISHED"
        );

        // Display newest activities first
        publishedActivities.sort((a, b) => {
          const dateA = new Date(a.activityDate || a.createdAt);
          const dateB = new Date(b.activityDate || b.createdAt);

          return dateB - dateA;
        });

        setActivities(publishedActivities);
        setError("");
      } catch (err) {
        console.error("Activities loading error:", err);
        setError("Unable to load activities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadActivities();

    // Automatically check for new published activities every 30 seconds
    const refreshInterval = setInterval(loadActivities, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  const formatDate = (date) => {
    if (!date) return "Date not available";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "Date not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <Header />
      

      <main className="public-activities-page">
        <section className="public-activities-hero">
          <h1>NSS Activities & Events</h1>

          <p>
            Explore the social service activities, environmental initiatives,
            awareness programs and community contributions of NSS RGUKT Basar.
          </p>
        </section>

        <section className="public-activities-content">
          <div className="public-activities-heading">
            <h2>Our Activities</h2>
            <p>
              Every activity reflects our commitment to service and community.
            </p>
          </div>

          {loading && (
            <div className="public-activities-loading">
              Loading activities...
            </div>
          )}

          {!loading && error && (
            <div className="public-activities-error">{error}</div>
          )}

          {!loading && !error && activities.length === 0 && (
            <div className="public-activities-empty">
              <h3>No activities published yet</h3>
              <p>New NSS activities will appear here soon.</p>
            </div>
          )}

          {!loading && !error && activities.length > 0 && (
            <div className="public-activities-grid">
              {activities.map((activity) => (
                <article className="public-activity-item" key={activity.id}>
                  <div className="public-activity-meta">
                    <span className="public-activity-date">
                      📅 {formatDate(activity.activityDate)}
                    </span>

                    <p className="public-activity-location">
                      📍 {activity.location || "RGUKT Basar"}
                    </p>
                  </div>

                  <ActivityCard
                    title={activity.title}
                    description={activity.description}
                    images={activity.images || []}
                  />
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default PublicActivities;
