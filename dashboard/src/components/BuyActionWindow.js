import React, { useState, useContext, useEffect } from "react";
import axios from "../axiosConfig";

import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, mode }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [availableQty, setAvailableQty] = useState(null);
  const [qtyError, setQtyError] = useState("");
  const generalContext = useContext(GeneralContext);

  useEffect(() => {
    if (mode === "SELL") {
      axios.get("http://localhost:3002/allHoldings").then((res) => {
        const holding = res.data.find((stock) => stock.name === uid);
        setAvailableQty(holding ? holding.qty : 0);
      });
    }
  }, [mode, uid]);

  const handleQtyChange = (e) => {
    const value = Number(e.target.value);
    setStockQuantity(e.target.value);

    if (mode === "SELL" && availableQty !== null && value > availableQty) {
      setQtyError(`You only have ${availableQty} shares available to sell`);
    } else {
      setQtyError("");
    }
  };

  const handleOrderClick = () => {
    if (
      mode === "SELL" &&
      availableQty !== null &&
      Number(stockQuantity) > availableQty
    ) {
      setQtyError(`You only have ${availableQty} shares available to sell`);
      return;
    }

    axios
      .post("http://localhost:3002/newOrder", {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: mode,
      })
      .then(() => {
        generalContext.triggerRefresh();
        generalContext.closeBuyWindow();
      })
      .catch((err) => {
        alert(err.response?.data || "Something went wrong");
      });
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        {mode === "SELL" && availableQty !== null && (
          <p style={{ fontSize: "0.8rem", color: "#666", marginBottom: "8px" }}>
            Available to sell: <strong>{availableQty}</strong>
          </p>
        )}
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={handleQtyChange}
              value={stockQuantity}
              min="1"
              max={mode === "SELL" ? availableQty : undefined}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
        {qtyError && (
          <p style={{ color: "#d32f2f", fontSize: "0.8rem" }}>{qtyError}</p>
        )}
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <button
            className={mode === "SELL" ? "btn btn-red" : "btn btn-blue"}
            onClick={handleOrderClick}
            disabled={!!qtyError}
            style={qtyError ? { opacity: 0.5, cursor: "not-allowed" } : {}}
          >
            {mode === "SELL" ? "Sell" : "Buy"}
          </button>
          <button className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
