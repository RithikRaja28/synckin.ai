// Dashboard.js
import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./utils/Sidebar";
import Header from "./utils/Header";
import "./Dashboard.css";
import { AuthContext } from "../../context/AuthContext";
import InventoryManager from "../InventoryManagement/InventorySystem";
import TaskManager from "../TaskManagement/TaskManager";
import IncomePage from "../Finance Tracker/IncomePage";
import FinanceTracker from "../Finance Tracker/FinanceTracker";
import IncomeChart from "../Finance Tracker/utils/IncomeChart";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [incomes, setIncomes] = useState([]);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/login");
      console.log("User is not authenticated. Redirecting to login...");
    }
    
  }, [auth.isAuthenticated, navigate]);

  useEffect(() => {
    // Fetch income data for the chart
    axios
      .get("http://localhost:5000/api/income/show", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then((response) => {
        const incomeData = Array.isArray(response.data) ? response.data : [];
        setIncomes(incomeData);
      })
      .catch((error) =>
        console.error("There was an error fetching the incomes!", error)
      );
  }, []);

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
                  <IncomeChart incomes={incomes} />
                </div>
              }
            />
            <Route path="/inventorytracker" element={<InventoryManager />} />
            <Route path="/taskmanager" element={<TaskManager />} />
            <Route path="/financetracker" element={<FinanceTracker />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
