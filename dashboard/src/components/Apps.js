import React from "react";

const Apps = () => {
  return (
    <div style={{ padding: "40px" }}>
      <h3 style={{ marginBottom: "20px" }}>Apps</h3>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: "8px",
          padding: "24px",
          maxWidth: "600px",
        }}
      >
        <div>
          <h4 style={{ margin: "0 0 6px" }}>TradeVista Website</h4>
          <p style={{ margin: 0, color: "#888", fontSize: "0.85rem" }}>
            Visit our main website to learn more.
          </p>
        </div>
        <a
          href="http://localhost:3001"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#4184f3",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "4px",
            textDecoration: "none",
            fontSize: "0.85rem",
          }}
        >
          Visit Website
        </a>
      </div>
    </div>
  );
};

export default Apps;
