import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "../axiosConfig";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import RedirectIfAuthenticated from "./RedirectIfAuthenticated";
import AuthContext from "./AuthContext";

const Home = () => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth/current-user`)
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated user={user}>
              <Login setUser={setUser} />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuthenticated user={user}>
              <Register />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute user={user}>
              <>
                <TopBar />
                <Dashboard />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthContext.Provider>
  );
};

export default Home;
