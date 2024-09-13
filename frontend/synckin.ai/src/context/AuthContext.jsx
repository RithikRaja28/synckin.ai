import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create AuthContext
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    token: null,
    user: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      // Set the token in the request header
      axios
        .get("http://localhost:5000/auth/user", {
          headers: { "x-auth-token": token },
        })
        .then((res) => {
          setAuth({
            isAuthenticated: true,
            token,
            user: res.data,
          });
          console.log("User details fetched: ", res.data);
        })
        .catch((err) => {
          console.error("Error fetching user details: ", err);
          localStorage.removeItem("token"); // Remove the token if fetching fails
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
      // Fetch user details immediately after login
      const userResponse = await axios.get("http://localhost:5000/auth/user", {
        headers: { "x-auth-token": res.data.token },
      });
      setAuth({
        isAuthenticated: true,
        token: res.data.token,
        user: userResponse.data, // Set the user after logging in
      });
      console.log("Login successful");
    } catch (err) {
      console.error("Login error:", err.response.data);
      throw err;
    }
  };

  const register = async (username, email, password,role) => {
    try {
      const res = await axios.post("http://localhost:5000/auth/register", {
        username,
        email,
        password,
        role
      });
      localStorage.setItem("token", res.data.token);
      // Fetch user details immediately after registration
      const userResponse = await axios.get("http://localhost:5000/auth/user", {
        headers: { "x-auth-token": res.data.token },
      });
      setAuth({
        isAuthenticated: true,
        token: res.data.token,
        user: userResponse.data, // Set the user after registration
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

// Export both AuthContext and AuthProvider
export { AuthContext, AuthProvider };
