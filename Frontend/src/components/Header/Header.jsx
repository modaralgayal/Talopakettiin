import React from "react";
import "../../styles/header.scss";
import logo from "/public/images/logo-white.png";
import { NavLink } from "react-router-dom";
import MainMenu from "../Menus/MainMenu";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useBurgerMenu } from "../../hooks/useBurgerMenu";

const Header = () => {
  const isTablet = useMediaQuery("(min-width: 768px)");
  const { showBurgerMenu, handleBurgerMenu } = useBurgerMenu(isTablet);

  return (
    <header className="header">
      <NavLink to="/">
        <img src={logo} alt="Logo" className="header__logo" />
      </NavLink>

      <MainMenu
        handleBurgerMenu={!isTablet && handleBurgerMenu}
        open={showBurgerMenu}
      />

      {!isTablet && (
        <div
          onClick={handleBurgerMenu}
          className={`header__button${showBurgerMenu ? " open" : ""}`}
        >
          <span></span>
        </div>
      )}
    </header>
  );
};
export default Header;
