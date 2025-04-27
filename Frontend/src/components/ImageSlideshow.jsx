import React, { useState, useEffect, useMemo } from 'react';

// Dynamically import all images from the stock_images folder
const imageModules = import.meta.glob('/src/assets/stock_images/*.{jpg,png,jpeg}', { eager: true });
const images = Object.values(imageModules).map((mod) => mod.default);

export const ImageSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    // Preload images
    const loadImages = async () => {
      try {
        await Promise.all(
          images.map((src) => {
            return new Promise((resolve, reject) => {
              const img = new window.Image();
              img.src = src;
              img.onload = resolve;
              img.onerror = reject;
            });
          })
        );
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };
    loadImages();
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [imagesLoaded]);

  if (!imagesLoaded) {
    return (
      <div className="relative w-full h-[600px] bg-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <style>{`
        @keyframes zoom {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        .animate-zoom {
          animation: zoom 5s linear forwards;
        }
      `}</style>
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Slideshow image ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-1000"
            style={{
              transform: index === currentIndex ? 'scale(1)' : 'scale(1.08)',
              animation: index === currentIndex ? 'zoom 5s linear forwards' : 'none',
              willChange: 'transform',
            }}
            onError={(e) => {
              console.error(`Error loading image ${index + 1}:`, e);
              e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
            }}
          />
        </div>
      ))}
    </div>
  );
};
