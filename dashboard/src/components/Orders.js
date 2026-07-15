import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "../axiosConfig";
import GeneralContext from "./GeneralContext";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { refreshFlag } = useContext(GeneralContext);

  const fetchOrders = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/allOrders`).then((res) => {
      setAllOrders(res.data);
    });
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshFlag]);

  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/deleteOrder/${id}`)
      .then(() => {
        fetchOrders();
      });
  };

  const filteredOrders = allOrders.filter((order) =>
    order.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalBuyValue = allOrders
    .filter((order) => order.mode === "BUY")
    .reduce((sum, order) => sum + order.qty * order.price, 0);

  const totalSellValue = allOrders
    .filter((order) => order.mode === "SELL")
    .reduce((sum, order) => sum + order.qty * order.price, 0);

  return (
    <div className="orders">
      {allOrders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to={"/"} className="btn">
            Get started
          </Link>
        </div>
      ) : (
        <div className="order-table">
          <h3 className="title">Orders ({allOrders.length})</h3>

          <div className="row" style={{ marginBottom: "16px" }}>
            <div className="col">
              <h5>{totalBuyValue.toFixed(2)}</h5>
              <p>Total buy value</p>
            </div>
            <div className="col">
              <h5>{totalSellValue.toFixed(2)}</h5>
              <p>Total sell value</p>
            </div>
          </div>

          <input
            type="text"
            placeholder="Search by stock name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              marginBottom: "12px",
              padding: "6px 10px",
              width: "250px",
            }}
          />

          <table>
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Qty.</th>
                <th>Price</th>
                <th>Mode</th>
                <th>Time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const modeClass = order.mode === "BUY" ? "profit" : "loss";

                return (
                  <tr key={order._id}>
                    <td>{order.name}</td>
                    <td>{order.qty}</td>
                    <td>{order.price.toFixed(2)}</td>
                    <td className={modeClass}>{order.mode}</td>
                    <td>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleTimeString()
                        : "-"}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(order._id)}
                        style={{
                          background: "#d4d4d4",
                          color: "#666",
                          border: "none",
                          borderRadius: "2px",
                          padding: "6px 12px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
