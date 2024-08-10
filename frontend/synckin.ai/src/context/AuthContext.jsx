import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    token: null,
    user: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuth({
        isAuthenticated: true,
        token,
        user: null, // You can set user data here if needed
      });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setAuth({
        isAuthenticated: true,
        token: res.data.token,
        user: null,
      });
      console.log("Login successful");
    } catch (err) {
      console.error("Login error:", err.response.data);
      throw err;
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/auth/register", {
        username,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setAuth({
        isAuthenticated: true,
        token: res.data.token,
        user: null,
      });
    } catch (err) {
      console.error("Registration error:", err);
    
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({
      isAuthenticated: false,
      token: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
