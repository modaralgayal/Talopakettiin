import "../../styles/hero.scss";
import useHero from "../../hooks/useHero";
import heroSlides from "../../configs/heroSlides";
const Hero = ({ showArrows = false, showPagination = true }) => {
  const {
    currentSlide,
    isAnimating,
    getSlideClass,
    goToSlide,
    nextSlide,
    prevSlide,
  } = useHero({ heroSlides, autoplay: true, duration: 5000 });

  const maxSlide = heroSlides.length;

  return (
    <section className="hero" id="js-header">
      {heroSlides.map((slide, index) => {
        const slideNumber = index + 1;
        return (
          <div
            key={index}
            className={`hero__slide js-slider-home-slide ${getSlideClass(
              slideNumber
            )}`}
            data-slide={slideNumber}
          >
            <div
              className="hero__slide-background-parallax background-absolute js-parallax"
              data-speed="-1"
              data-position="top"
              data-target="#js-header"
            >
              <div className="hero__slide-background-load-wrap background-absolute">
                <div className="hero__slide-background-load background-absolute">
                  <div className="hero__slide-background-wrap background-absolute">
                    <div className="hero__slide-background background-absolute">
                      <div className="hero__slide-image-wrap background-absolute">
                        <div
                          className="hero__slide-image background-absolute"
                          // style={{ backgroundImage: `url(${slide.image})` }}
                          style={{ backgroundImage: `url(${slide.image})` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero__slide-caption">
              <div className="hero__slide-caption-text">
                <div
                  className="hero__container js-parallax"
                  data-speed="2"
                  data-position="top"
                  data-target="#js-header"
                >
                  <h1 className="hero__slide-caption-title">{slide.title}</h1>
                  <a
                    className="hero__slide-caption-subtitle -load o-hsub -link"
                    href={slide.link || "#"}
                  >
                    <span className="hero__slide-caption-subtitle-label">
                      {slide.subtitle}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {maxSlide > 1 && (
        <div className="c-header-home_footer">
          <div className="o-container">
            <div className="c-header-home_controls -nomobile o-button-group">
              <div
                className="js-parallax is-inview"
                data-speed="1"
                data-position="top"
                data-target="#js-header"
              >
                {showArrows && (
                  <>
                    <button
                      className="o-button -white -square -left js-slider-home-button js-slider-home-prev"
                      type="button"
                      onClick={prevSlide}
                      disabled={isAnimating}
                    >
                      <span className="o-button_label">
                        <svg className="o-button_icon" role="img">
                          <use xlinkHref="#arrow-prev"></use>
                        </svg>
                      </span>
                    </button>
                    <button
                      className="o-button -white -square js-slider-home-button js-slider-home-next"
                      type="button"
                      onClick={nextSlide}
                      disabled={isAnimating}
                    >
                      <span className="o-button_label">
                        <svg className="o-button_icon" role="img">
                          <use xlinkHref="#arrow-next"></use>
                        </svg>
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPagination && maxSlide > 1 && (
        <div className="pagination">
          <div className="hero__container">
            {heroSlides.map((_, index) => {
              const slideNumber = index + 1;
              return (
                <span
                  key={index}
                  className={`pagination__item js-pagination-item ${
                    currentSlide === slideNumber ? "is-current" : ""
                  }`}
                  data-slide={slideNumber}
                  onClick={() => goToSlide(slideNumber)}
                >
                  {slideNumber}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <svg xmlns="http://www.w3.org/2000/svg">
        <symbol viewBox="0 0 18 18" id="arrow-next">
          <path
            id="arrow-next-arrow.svg"
            d="M12.6,9L4,17.3L4.7,18l8.5-8.3l0,0L14,9l0,0l-0.7-0.7l0,0L4.7,0L4,0.7L12.6,9z"
          />
        </symbol>
        <symbol viewBox="0 0 18 18" id="arrow-prev">
          <path
            id="arrow-prev-arrow.svg"
            d="M14,0.7L13.3,0L4.7,8.3l0,0L4,9l0,0l0.7,0.7l0,0l8.5,8.3l0.7-0.7L5.4,9L14,0.7z"
          />
        </symbol>
      </svg>
    </section>
  );
};

export default Hero;
