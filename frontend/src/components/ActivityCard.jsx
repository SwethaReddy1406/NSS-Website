import { useEffect, useState } from "react";

function ActivityCard({ images, title, description }) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [images.length]);

  const previousImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + images.length) % images.length
    );
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  return (
    <article className="activity-card">

      <div className="activity-image-container">

        <img
          src={images[currentImage]}
          alt={title}
        />

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
          {images.map((_, index) => (
            <span
              key={index}
              className={
                index === currentImage
                  ? "dot active"
                  : "dot"
              }
            ></span>
          ))}
        </div>

      </div>

      <div className="activity-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

    </article>
  );
}

export default ActivityCard;
