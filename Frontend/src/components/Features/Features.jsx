import "../../styles/features.scss";
import features from "../../configs/features";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Features = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);
  return (
    <section className="features" data-aos="fade-up">
      <div className="heading-container">
        <div className="heading-container__content">
          <h2 className="heading-container__title title">
            Discover Your Dream Home Today
          </h2>
        </div>
      </div>

      {/* <div className="features__background"> */}
      <div className="features__wrapper">
        {features.map((feature, index) => {
          return (
            <div className="features__item" key={index}>
              <div
                className="features__cover"
                style={{ backgroundImage: `url(${feature.image})` }}
              ></div>
            </div>
          );
        })}
      </div>
      {/* </div> */}
    </section>
  );
};
export default Features;
