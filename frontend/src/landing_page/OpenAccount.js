import React from "react";

function OpenAccount() {
  return (
    <div class="container p-5 mt-3">
      <div class="row text-center">
        <h1 className="mt-5 mb-4  ">Open a TradeVista account</h1>
        <p>
          Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and
          F&O trades.
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

export default OpenAccount;
