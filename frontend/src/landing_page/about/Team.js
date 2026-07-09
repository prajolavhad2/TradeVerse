import React from "react";

function Team() {
  return (
    <div class="container">
      <div class="row p-3 mt-5 border-top">
        <h1 className=" text-center ">People</h1>
      </div>
      <div
        class="row p-3 text-muted "
        style={{ lineHeight: "1.8", fontSize: "1.2em" }}
      >
        <div class="col-6 p-5 text-center">
          <img
            src="media/images/nithinKamath.jpg"
            alt="Nitinkumar"
            style={{ width: "50%", borderRadius: "100%" }}
          />
          <h4 className="mt-5">Nitin Kamath</h4>
          <h6>Founder, CEO</h6>
        </div>
        <div class="col-6 p-5">
          <p>
            Nithin bootstrapped and founded TradeVista in 2010 to overcome the
            hurdles he faced during his decade long stint as a trader. Today,
            TradeVista has changed the landscape of the Indian broking industry.
          </p>
          <p>
            {" "}
            He is a member of the SEBI Secondary Market Advisory Committee
            (SMAC) and the Market Data Advisory Committee (MDAC).
          </p>
          <p> Playing basketball is his zen.</p>
          <p>
            {" "}
            Connect on{" "}
            <a href="" style={{ textDecoration: "none" }}>
              Homepage
            </a>{" "}
            /{" "}
            <a href="" style={{ textDecoration: "none" }}>
              TradingQnA
            </a>{" "}
            /{" "}
            <a href="" style={{ textDecoration: "none" }}>
              Twitter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Team;
