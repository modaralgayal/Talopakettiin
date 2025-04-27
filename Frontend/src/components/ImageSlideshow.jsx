import React, { useState, useEffect } from 'react';

import img1 from '/src/assets/stock_images/pexels-frans-van-heerden-201846-1438832.jpg';
import img2 from '/src/assets/stock_images/pexels-davidmcbee-1546166.jpg';
import img3 from '/src/assets/stock_images/pexels-binyaminmellish-106399.jpg';
import img4 from '/src/assets/stock_images/pexels-pixabay-259588.jpg';

const images = [img1, img2, img3, img4];

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
              const img = new Image();
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
    <div className="relative w-full h-[600px] overflow-hidden">
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
            className="w-full h-full object-cover"
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
