import React from "react";

function Awards() {
  return (
    <div class="container">
      <div class="row">
        <div class="col-6 p-5   ">
          <img src="media/images/largestBroker.svg" />
        </div>
        <div class="col-6 p-5 mt-5">
          <h1>Largest stock broker in India</h1>
          <p className="mb-5">
            2+ million TradeVista clients contribute to over 15% of all retail
            order volumes in india daily by trading and inversting in:
          </p>
          <div class="row">
            <div class="col-6">
              <ul>
                <li>
                  <p>Futures and Options</p>
                </li>
                <li>
                  <p>Commodity derivatives</p>
                </li>
                <li>
                  <p>currency derivatives</p>
                </li>
              </ul>
            </div>
            <div class="col-6">
              <ul>
                <li>
                  <p>Stocks and IPOs</p>
                </li>
                <li>
                  <p>Direct mutual funds</p>
                </li>
                <li>
                  <p>Bonds and Govt. Securities</p>
                </li>
              </ul>
            </div>
          </div>
          <img src="media/images/pressLogos.png" style={{ width: "95%" }} />
        </div>
      </div>
    </div>
  );
}

export default Awards;
