import { useState, useEffect } from "react";

export const useBurgerMenu = (isTablet) => {
  const [showBurgerMenu, setShowBurgerMenu] = useState(false);

  const handleBurgerMenu = () => {
    setShowBurgerMenu(!showBurgerMenu);
  };

  // Block scrolling when menu is open
  useEffect(() => {
    if (showBurgerMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showBurgerMenu]);

  // Close menu when screen is resized
  useEffect(() => {
    if (isTablet) {
      setShowBurgerMenu(false);
    }
  }, [isTablet]);

  return {
    showBurgerMenu,
    handleBurgerMenu,
  };
};
