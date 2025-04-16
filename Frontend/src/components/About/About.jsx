import "../../styles/about.scss";
import { NavLink } from "react-router-dom";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <section className="about" name="about" data-aos="fade-up">
      {/* Mission Section */}
      <section className="heading-container ">
        <div className="heading-container__content">
          <h2 className="heading-container__title title">Talopaketti</h2>
          <p className="heading-container__text">
            We're transforming real estate connections through intelligent
            matching technology that understands both properties and people at a
            deeper level.
          </p>
        </div>
      </section>
      {/* Value Proposition Cards */}
      <div className="card-container">
        {/* Home Seekers Card */}
        <div className="card home-seekers">
          <div className="card-bg"></div>
          <div className="card-content">
            <h2>Find Your Dream Home</h2>
            <p className="card-desc">
              Our AI-powered platform learns your preferences to match you with
              perfect properties.
            </p>
            <ul className="card-features">
              <li>
                <span>✓</span> Personalized recommendations
              </li>
              <li>
                <span>✓</span> Virtual & 3D tours
              </li>
              <li>
                <span>✓</span> Neighborhood analytics
              </li>
              <li>
                <span>✓</span> Real-time alerts
              </li>
              <li>
                <span>✓</span> Transparent pricing
              </li>
            </ul>
            <NavLink className="card-cta">
              Start Your Search{" "}
              <svg width="13px" height="10px" viewBox="0 0 13 10">
                <path d="M1,5 L11,5"></path>
                <polyline points="8 1 12 5 8 9"></polyline>
              </svg>
            </NavLink>
          </div>
        </div>

        {/* Providers Card */}
        <div className="card property-professionals">
          <div className="card-bg"></div>
          <div className="card-content">
            <h2>For Property Professionals</h2>
            <p className="card-desc">
              Connect with qualified buyers perfectly matched to your listings.
            </p>
            <ul className="card-features">
              <li>
                <span>✓</span> Smart lead matching
              </li>
              <li>
                <span>✓</span> Digital showcase tools
              </li>
              <li>
                <span>✓</span> Market analytics
              </li>
              <li>
                <span>✓</span> Performance dashboards
              </li>
              <li>
                <span>✓</span> Automated scheduling
              </li>
            </ul>
            <NavLink className="card-cta">
              List Properties{" "}
              <svg width="13px" height="10px" viewBox="0 0 13 10">
                <path d="M1,5 L11,5"></path>
                <polyline points="8 1 12 5 8 9"></polyline>
              </svg>
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
