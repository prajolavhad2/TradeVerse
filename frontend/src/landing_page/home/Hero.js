import React from "react";

function Hero() {
  return (
    <div className="container p-5 mb-5">
      <div className="row text-center">
        <img
          src="media/images/homeHero.png"
          alt="Home Hero image"
          className="mb-5"
        />
        <h1 className="mt-5">Invest in Everything</h1>
        <p>
          Online platform for investing in stocks, derivatives, mutual funds,
          and more.
        </p>
        <a
          href={`${process.env.REACT_APP_DASHBOARD_URL}/register`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 btn btn-primary fs-5 mb-5"
          style={{ width: "20%", margin: "0 auto", textDecoration: "none" }}
        >
          SignUp Now
        </a>
      </div>
    </div>
  );
}

export default Hero;
