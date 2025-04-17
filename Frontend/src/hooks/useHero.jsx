import { useState, useEffect, useRef } from "react";

const useHero = ({ heroSlides = [], autoplay = true, duration = 4000 }) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const intervalRef = useRef(null);
  const animationDuration = 1000;
  const maxSlide = heroSlides.length;

  // Initialize the slideshow
  const initSlideshow = () => {
    setLoaded(true);
    document.body.classList.add("is-loaded");

    const timer = setTimeout(() => {
      document.body.classList.add("is-animated");
    }, 600);

    if (autoplay && maxSlide > 1) {
      startAutoplay();
    }

    return () => clearTimeout(timer);
  };

  // Start autoplay
  const startAutoplay = () => {
    clearInterval(intervalRef.current); // Clear any existing interval
    intervalRef.current = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, duration);
  };

  // Prevent rapid clicks during animation
  const preventClick = () => {
    setIsAnimating(true);
    clearInterval(intervalRef.current);

    setTimeout(() => {
      setIsAnimating(false);
      if (autoplay && maxSlide > 1) {
        startAutoplay(); // Restart autoplay after animation
      }
    }, animationDuration);
  };

  // Navigate to a specific slide
  const goToSlide = (index) => {
    if (isAnimating) return;

    let slideIndex = parseInt(index);

    if (slideIndex > maxSlide) {
      slideIndex = 1;
    }

    if (slideIndex < 1) {
      slideIndex = maxSlide;
    }

    setCurrentSlide(slideIndex);
  };

  // Go to next slide
  const nextSlide = () => {
    preventClick();
    setCurrentSlide((prev) => (prev >= maxSlide ? 1 : prev + 1));
  };

  // Go to previous slide
  const prevSlide = () => {
    preventClick();
    setCurrentSlide((prev) => (prev <= 1 ? maxSlide : prev - 1));
  };

  // Get the class for a slide based on its position
  const getSlideClass = (slideIndex) => {
    if (slideIndex === currentSlide) return "is-current";
    if (
      slideIndex === currentSlide - 1 ||
      (currentSlide === 1 && slideIndex === maxSlide)
    )
      return "is-prev";
    if (
      slideIndex === currentSlide + 1 ||
      (currentSlide === maxSlide && slideIndex === 1)
    )
      return "is-next";
    return "";
  };

  // Initialize on mount
  useEffect(() => {
    const cleanup = initSlideshow();
    return () => {
      cleanup?.();
      clearInterval(intervalRef.current);
    };
  }, []);

  // Reset autoplay when currentSlide changes
  useEffect(() => {
    if (autoplay && maxSlide > 1) {
      startAutoplay();
    }
  }, [currentSlide, autoplay, maxSlide]);

  return {
    currentSlide,
    isAnimating,
    loaded,
    getSlideClass,
    goToSlide,
    nextSlide,
    prevSlide,
  };
};
export default useHero;
