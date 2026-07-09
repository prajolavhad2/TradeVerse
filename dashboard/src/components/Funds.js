import React, { useState, useEffect, useContext } from "react";
import axios from "../axiosConfig";
import GeneralContext from "./GeneralContext";

const Funds = () => {
  const [funds, setFunds] = useState(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const { refreshFlag, triggerRefresh } = useContext(GeneralContext);

  const fetchFunds = () => {
    axios.get("http://localhost:3002/funds").then((res) => {
      setFunds(res.data);
    });
  };

  useEffect(() => {
    fetchFunds();
  }, [refreshFlag]);

  const handleAddFunds = async () => {
    setMessage("");
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      setMessage("Enter a valid amount");
      return;
    }

    try {
      const { data: order } = await axios.post(
        "http://localhost:3002/funds/create-order",
        { amount: numAmount },
      );

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "TradeVista",
        description: "Add funds to wallet",
        order_id: order.id,
        handler: async (response) => {
          try {
            await axios.post("http://localhost:3002/funds/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: numAmount,
            });
            setAmount("");
            fetchFunds();
            triggerRefresh();
          } catch (err) {
            setMessage("Payment verification failed");
          }
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#4184f3",
        },
      };

      const razorpayCheckout = new window.Razorpay(options);
      razorpayCheckout.open();
    } catch (err) {
      setMessage(err.response?.data || "Something went wrong");
    }
  };

  const handleWithdraw = () => {
    setMessage("");
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      setMessage("Enter a valid amount");
      return;
    }

    axios
      .post("http://localhost:3002/funds/withdraw", { amount: numAmount })
      .then(() => {
        setAmount("");
        fetchFunds();
        triggerRefresh();
      })
      .catch((err) => {
        setMessage(err.response?.data || "Something went wrong");
      });
  };

  if (!funds) return <p style={{ padding: "16px" }}>Loading...</p>;

  const available = funds.available ?? 0;
  const usedMargin = funds.usedMargin ?? 0;
  const total = funds.total ?? 0;

  return (
    <>
      <h3 className="title">Funds</h3>

      <div className="row" style={{ marginBottom: "20px" }}>
        <div className="col">
          <h5>{available.toFixed(2)}</h5>
          <p>Available balance</p>
        </div>
        <div className="col">
          <h5>{usedMargin.toFixed(2)}</h5>
          <p>Used margin</p>
        </div>
        <div className="col">
          <h5>{total.toFixed(2)}</h5>
          <p>Total balance</p>
        </div>
      </div>

      <div style={{ maxWidth: "320px", padding: "0 16px" }}>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 10px",
            marginBottom: "10px",
            boxSizing: "border-box",
          }}
        />

        {message && (
          <p style={{ color: "#d32f2f", fontSize: "0.85rem" }}>{message}</p>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-blue" onClick={handleAddFunds}>
            Add Funds
          </button>
          <button className="btn btn-red" onClick={handleWithdraw}>
            Withdraw
          </button>
        </div>
      </div>
    </>
  );
};

export default Funds;
