import React from "react";

function Universe() {
  return (
    <div className="container mt-5 text-center">
      <div className="row mt-5">
        <h1>The TradeVista Universe</h1>
        <p>
          Extend your trading and investment experience even further with our
          partner platforms
        </p>

        <div className="col-4 mt-5">
          <img src="media/images/smallcaseLogo.png" style={{ width: "50%" }} />
          <p className="text-small text-muted">Thematic investment platform</p>
        </div>
        <div className="col-4  mt-5">
          <img src="media/images/streakLogo.png" style={{ width: "40%" }} />
          <p className="text-small text-muted">Algo & strategy platform</p>
        </div>
        <div className="col-4  mt-5">
          <img src="media/images/sensibullLogo.svg" style={{ width: "50%" }} />
          <p className="text-small text-muted mt-3">Options trading platform</p>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-4 ">
          <img
            src="media/images/TradeVistaFundhouse.png"
            style={{ width: "50%" }}
          />
          <p className="text-small text-muted">Asset managemnet</p>
        </div>
        <div className="col-4 ">
          <img src="media/images/goldenpiLogo.png" style={{ width: "50%" }} />
          <p className="text-small text-muted">Bonds trading platform</p>
        </div>
        <div className="col-4 ">
          <img src="media/images/dittoLogo.png" style={{ width: "40%" }} />
          <p className="text-small text-muted">Insurance</p>
        </div>
      </div>
      <a
        href="http://localhost:3000/register"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 btn btn-primary fs-5 mb-5"
        style={{ width: "20%", margin: "0 auto", textDecoration: "none" }}
      >
        SignUp Now
      </a>
    </div>
  );
}

export default Universe;
