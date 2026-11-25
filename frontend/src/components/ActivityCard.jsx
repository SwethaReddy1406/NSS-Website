
import { useEffect, useState } from "react";

const fallbackImage = "/IMG-20250819-WA0021.jpg";

function ActivityCard({ images = [], title, description }) {
  const safeImages = images.length > 0 ? images : [fallbackImage];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    setCurrentImage(0);

    if (safeImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % safeImages.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [safeImages.length]);

  const previousImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + safeImages.length) % safeImages.length
    );
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % safeImages.length);
  };

  return (
    <article className="activity-card">
      <div className="activity-image-container">
        <img
          src={safeImages[currentImage]}
          alt={title}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallbackImage;
          }}
        />

        {safeImages.length > 1 && (
          <>
            <button
              className="activity-arrow left-arrow"
              onClick={previousImage}
              aria-label="Previous image"
            >
              ‹
            </button>

            <button
              className="activity-arrow right-arrow"
              onClick={nextImage}
              aria-label="Next image"
            >
              ›
            </button>

            <div className="activity-dots">
              {safeImages.map((_, index) => (
                <span
                  key={index}
                  className={
                    index === currentImage ? "dot active" : "dot"
                  }
                ></span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="activity-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}

export default ActivityCard;


