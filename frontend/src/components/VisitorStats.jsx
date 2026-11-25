import { useEffect, useState } from "react";

function VisitorStats() {
  const [stats, setStats] = useState({
    volunteers: 0,
    activities: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/statistics");

        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Statistics loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <section className="visitor-stats">

      <div className="stat-card">
        <strong>{loading ? "..." : stats.volunteers}</strong>
        <span>Active Volunteers</span>
      </div>

      <div className="stat-card">
        <strong>{loading ? "..." : stats.activities}</strong>
        <span>Activities</span>
      </div>

    </section>
  );
}

export default VisitorStats;
