import React, { useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./utils/Sidebar";
import Header from "./utils/Header";

import "./Dashboard.css";
import { AuthContext } from "../../context/AuthContext";
import InventoryManager from "../InventoryManagement/InventorySystem";
import TaskManager from "../TaskManagement/TaskManager";
const Dashboard = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  console.log(auth);
  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/login");
      console.log("User is not authenticated. Redirecting to login...");
    }
  }, [auth.isAuthenticated, navigate]);
  return (
    <div className="d-flex vh-100 w-100">
      <Sidebar />
      <div
        className="flex-grow-1 nav-ai"
        style={{
          marginLeft: "250px",
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        <Header />
        <div className="content p-4">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h1>Welcome to the Dashboard</h1>{" "}
                  {auth.user && <p>Hello, {auth.user.username}</p>}
                </div>
              }
            />
            <Route path="/inventorytracker" element={<InventoryManager />} />
            <Route path="/taskmanager" element={<TaskManager/>}/>
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
