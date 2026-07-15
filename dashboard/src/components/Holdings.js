import React, { useState, useEffect, useContext } from "react";
import axios from "../axiosConfig";
import VerticalGraph from "./VerticalGraph";
import GeneralContext from "./GeneralContext";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);
  const { refreshFlag } = useContext(GeneralContext);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/allHoldings`).then((res) => {
      setAllHoldings(res.data);
    });
  }, [refreshFlag]);

  const totalInvestment = allHoldings.reduce(
    (sum, stock) => sum + stock.avg * stock.qty,
    0,
  );

  const totalCurrentValue = allHoldings.reduce(
    (sum, stock) => sum + stock.price * stock.qty,
    0,
  );

  const totalPL = totalCurrentValue - totalInvestment;
  const totalPLPercent =
    totalInvestment > 0 ? (totalPL / totalInvestment) * 100 : 0;
  const isProfitOverall = totalPL >= 0;

  const enrichedHoldings = allHoldings.map((stock) => {
    const curValue = stock.price * stock.qty;
    const investedValue = stock.avg * stock.qty;
    const pl = curValue - investedValue;
    const plPercent = investedValue > 0 ? (pl / investedValue) * 100 : 0;
    const allocation =
      totalCurrentValue > 0 ? (curValue / totalCurrentValue) * 100 : 0;

    return { ...stock, curValue, pl, plPercent, allocation };
  });

  const sortedHoldings = [...enrichedHoldings].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (typeof valA === "string") {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? valA - valB : valB - valA;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  const bestPerformer =
    enrichedHoldings.length > 0
      ? enrichedHoldings.reduce((a, b) => (a.plPercent > b.plPercent ? a : b))
      : null;

  const worstPerformer =
    enrichedHoldings.length > 0
      ? enrichedHoldings.reduce((a, b) => (a.plPercent < b.plPercent ? a : b))
      : null;

  const data = {
    labels: allHoldings.map((stock) => stock.name),
    datasets: [
      {
        label: "Holdings",
        data: allHoldings.map((stock) => stock.price - stock.avg),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const sortArrow = (field) =>
    sortBy === field ? (sortAsc ? " ▲" : " ▼") : "";

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      {allHoldings.length === 0 ? (
        <p style={{ padding: "16px" }}>You don't hold any stocks yet.</p>
      ) : (
        <>
          {bestPerformer && worstPerformer && (
            <div className="row" style={{ marginBottom: "12px" }}>
              <div className="col">
                <h5 className="profit">
                  {bestPerformer.name} ({bestPerformer.plPercent.toFixed(2)}%)
                </h5>
                <p>Best performer</p>
              </div>
              <div className="col">
                <h5 className="loss">
                  {worstPerformer.name} ({worstPerformer.plPercent.toFixed(2)}%)
                </h5>
                <p>Worst performer</p>
              </div>
            </div>
          )}

          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort("name")}
                    style={{ cursor: "pointer" }}
                  >
                    Instrument{sortArrow("name")}
                  </th>
                  <th
                    onClick={() => handleSort("qty")}
                    style={{ cursor: "pointer" }}
                  >
                    Qty.{sortArrow("qty")}
                  </th>
                  <th>Avg. cost</th>
                  <th>LTP</th>
                  <th
                    onClick={() => handleSort("curValue")}
                    style={{ cursor: "pointer" }}
                  >
                    Cur. val{sortArrow("curValue")}
                  </th>
                  <th
                    onClick={() => handleSort("pl")}
                    style={{ cursor: "pointer" }}
                  >
                    P&L{sortArrow("pl")}
                  </th>
                  <th
                    onClick={() => handleSort("plPercent")}
                    style={{ cursor: "pointer" }}
                  >
                    P&L %{sortArrow("plPercent")}
                  </th>
                  <th>Allocation</th>
                </tr>
              </thead>
              <tbody>
                {sortedHoldings.map((stock, index) => {
                  const profClass = stock.pl >= 0 ? "profit" : "loss";

                  return (
                    <tr key={index}>
                      <td>{stock.name}</td>
                      <td>{stock.qty}</td>
                      <td>{stock.avg.toFixed(2)}</td>
                      <td>{stock.price.toFixed(2)}</td>
                      <td>{stock.curValue.toFixed(2)}</td>
                      <td className={profClass}>{stock.pl.toFixed(2)}</td>
                      <td className={profClass}>
                        {stock.plPercent.toFixed(2)}%
                      </td>
                      <td>{stock.allocation.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="row">
            <div className="col">
              <h5>{totalInvestment.toFixed(2)}</h5>
              <p>Total investment</p>
            </div>
            <div className="col">
              <h5>{totalCurrentValue.toFixed(2)}</h5>
              <p>Current value</p>
            </div>
            <div className="col">
              <h5 className={isProfitOverall ? "profit" : "loss"}>
                {totalPL.toFixed(2)} ({totalPLPercent.toFixed(2)}%)
              </h5>
              <p>P&L</p>
            </div>
          </div>

          <div className="graph">
            <VerticalGraph data={data} />
          </div>
        </>
      )}
    </>
  );
};

export default Holdings;
