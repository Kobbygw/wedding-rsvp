import { useState, useEffect } from 'react';

export function HeroSlideshow({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (!images.length) return null;

  return (
    <>
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          className="slow-zoom"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 30%",
            opacity: index === currentIndex ? 1 : 0,
            transition: "opacity 2s ease-in-out"
          }}
        />
      ))}
    </>
  );
}
