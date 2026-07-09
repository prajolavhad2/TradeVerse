import React from "react";

function Signup() {
  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "80px auto",
        textAlign: "center",
        padding: "0 20px",
      }}
    >
      <h2
        style={{
          fontSize: "1.6rem",
          fontWeight: 600,
          color: "#333",
          marginBottom: "10px",
        }}
      >
        Open a free demat account
      </h2>
      <p style={{ color: "#888", fontSize: "0.95rem", marginBottom: "32px" }}>
        Start your trading journey with zero commission on equity delivery and
        flat ₹20 on intraday and F&O trades.
      </p>

      <a
        href="http://localhost:3000/register"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          background: "#4184f3",
          color: "#fff",
          padding: "12px 32px",
          borderRadius: "4px",
          textDecoration: "none",
          fontSize: "0.95rem",
          fontWeight: 500,
          marginBottom: "16px",
        }}
      >
        Create an account
      </a>

      <p style={{ fontSize: "0.85rem", color: "#888" }}>
        Already have an account?{" "}
        <a
          href="http://localhost:3000/login"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#4184f3", fontWeight: 500, textDecoration: "none" }}
        >
          Login
        </a>
      </p>
    </div>
  );
}

export default Signup;
