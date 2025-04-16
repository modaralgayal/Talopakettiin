import React, { forwardRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import mainMenuConfig from "../../configs/mainMenuConfig";
import "../../styles/mainMenu.scss";
import { useSelector } from "react-redux";
import { Link as ScrollLink } from "react-scroll";
import { useAuth } from "../../hooks/useAuth";

const MainMenu = forwardRef(({ open, handleBurgerMenu }, ref) => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  const { userType } = useSelector((state) => state.userSlice);
  const isHashLink = (path) => path.startsWith("#");

  const handleAnchorClick = (path, e) => {
    if (window.location.pathname !== "/") {
      e.preventDefault();
      navigate("/", {
        state: { scrollTo: path.substring(1) },
      });
    } else {
      handleBurgerMenu();
    }
  };

  return (
    <nav ref={ref} className={`menu ${open ? "open" : ""} `}>
      <ul className="menu__list">
        {mainMenuConfig.map(
          (item) =>
            (item.userType === userType || item.userType === "all") && (
              <li
                key={item.name}
                className={`menu__item ${
                  item.name === "Sign In" ? "auth-btn" : ""
                } `}
              >
                {isHashLink(item.path) ? (
                  window.location.pathname === "/" ? (
                    <ScrollLink
                      to={item.path.substring(1)}
                      smooth={true}
                      offset={-50}
                      duration={100}
                      className="menu__link"
                      onClick={handleBurgerMenu}
                    >
                      {item.name}
                    </ScrollLink>
                  ) : (
                    <a
                      href={item.path}
                      className="menu__link"
                      onClick={(e) => handleAnchorClick(item.path, e)}
                    >
                      {item.name}
                    </a>
                  )
                ) : item.name === "Sign In" && userType !== null ? (
                  <NavLink
                    className="menu__link"
                    onClick={(e) => {
                      // handleBurgerMenu();
                      handleLogout(e);
                    }}
                  >
                    Log Out
                  </NavLink>
                ) : (
                  <NavLink
                    to={item.path}
                    className="menu__link"
                    onClick={handleBurgerMenu}
                  >
                    {item.name}
                  </NavLink>
                )}
              </li>
            )
        )}
      </ul>
    </nav>
  );
});

export default MainMenu;
