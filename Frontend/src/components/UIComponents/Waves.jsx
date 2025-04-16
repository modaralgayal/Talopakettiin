import "../../styles/waves.scss";

const Waves = () => {
  return (
    <div>
      <svg
        className="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="parallax">
          <use
            xlinkHref="#gentle-wave"
            x="48"
            y="0"
            fill="rgba(255, 251, 246, 0.3)"
          />
          <use
            xlinkHref="#gentle-wave"
            x="48"
            y="3"
            fill="rgba(237, 228, 209, 0.46)"
          />
          <use
            xlinkHref="#gentle-wave"
            x="48"
            y="5"
            fill="rgba(233, 229, 223, 0.3)"
          />
          <use
            xlinkHref="#gentle-wave"
            x="48"
            y="7"
            fill="rgba(233, 227, 222, 0.99)"
          />
        </g>
      </svg>
    </div>
  );
};

export default Waves;
