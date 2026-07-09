import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import AuthContext from "./AuthContext";

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3002/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";
  const isActive = (path) => location.pathname === path;

  return (
    <div className="menu-container">
      <img src="/logo.png" style={{ width: "50px" }} alt="logo" />
      <div className="menus">
        <ul>
          <li>
            <Link style={{ textDecoration: "none" }} to="/">
              <p className={isActive("/") ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/orders">
              <p className={isActive("/orders") ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/holdings">
              <p
                className={isActive("/holdings") ? activeMenuClass : menuClass}
              >
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/positions">
              <p
                className={isActive("/positions") ? activeMenuClass : menuClass}
              >
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/funds">
              <p className={isActive("/funds") ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link style={{ textDecoration: "none" }} to="/apps">
              <p className={isActive("/apps") ? activeMenuClass : menuClass}>
                Apps
              </p>
            </Link>
          </li>
        </ul>
        <hr />
        <div style={{ position: "relative" }}>
          <div className="profile" onClick={handleProfileClick}>
            <div className="avatar">
              {user?.username ? user.username.slice(0, 2).toUpperCase() : "U"}
            </div>
            <p className="username">{user?.username || "USERID"}</p>
          </div>

          {isProfileDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "48px",
                right: 0,
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "6px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                width: "200px",
                padding: "10px 0",
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  padding: "10px 16px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <p style={{ fontSize: "0.85rem", fontWeight: 600, margin: 0 }}>
                  {user?.username}
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#888",
                    margin: "2px 0 0",
                  }}
                >
                  {user?.email}
                </p>
              </div>
              <div
                onClick={handleLogout}
                style={{
                  padding: "10px 16px",
                  fontSize: "0.85rem",
                  color: "#d32f2f",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#fdecea")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
