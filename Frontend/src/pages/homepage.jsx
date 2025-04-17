import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import About from "../components/About";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { scroller } from "react-scroll";
import WaveSection from "../components/UIComponents/WaveSection";

export const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      scroller.scrollTo(location.state.scrollTo, {
        smooth: true,
        // offset: -50,
        duration: 100,
      });
    }
  }, [location.state]);
  return (
    <>
      <Hero showArrows={true} showPagination={true} />
      <About />
      <Features />
      <ContactForm />
      <Footer />
    </>
  );
};
