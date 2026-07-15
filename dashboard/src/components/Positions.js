import React, { useState, useEffect, useContext } from "react";
import axios from "../axiosConfig";
import GeneralContext from "./GeneralContext";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const { refreshFlag } = useContext(GeneralContext);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/allPositions`).then((res) => {
      setAllPositions(res.data);
    });
  }, [refreshFlag]);

  const totalDayPL = allPositions.reduce(
    (sum, stock) => sum + stock.totalPL,
    0,
  );

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      {allPositions.length === 0 ? (
        <p style={{ padding: "16px" }}>
          You haven't traded anything today yet.
        </p>
      ) : (
        <>
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Net Qty.</th>
                  <th>Avg. price</th>
                  <th>LTP</th>
                  <th>Realized P&L</th>
                  <th>Unrealized P&L</th>
                  <th>Total P&L</th>
                </tr>
              </thead>
              <tbody>
                {allPositions.map((stock, index) => {
                  const realizedClass =
                    stock.realizedPL >= 0 ? "profit" : "loss";
                  const unrealizedClass =
                    stock.unrealizedPL >= 0 ? "profit" : "loss";
                  const totalClass = stock.totalPL >= 0 ? "profit" : "loss";

                  return (
                    <tr key={index}>
                      <td>{stock.name}</td>
                      <td>{stock.netQty}</td>
                      <td>{stock.avgPrice.toFixed(2)}</td>
                      <td>{stock.ltp.toFixed(2)}</td>
                      <td className={realizedClass}>
                        {stock.realizedPL.toFixed(2)}
                      </td>
                      <td className={unrealizedClass}>
                        {stock.unrealizedPL.toFixed(2)}
                      </td>
                      <td className={totalClass}>{stock.totalPL.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="row">
            <div className="col">
              <h5 className={totalDayPL >= 0 ? "profit" : "loss"}>
                {totalDayPL.toFixed(2)}
              </h5>
              <p>Today's total P&L</p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Positions;
