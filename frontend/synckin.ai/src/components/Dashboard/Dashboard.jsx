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
import DebtChart from "../Finance Tracker/utils/DebtChart"; // Import the DebtChart
import axios from "axios";
import SavingsChart from "../Finance Tracker/utils/SavingsChart";
import FamilyConnect from "../Family Connect/FamilyConnect";

const Dashboard = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [incomes, setIncomes] = useState([]);
  const [debts, setDebts] = useState([]); // State for debts
   const [savings, setSavings] = useState([]);

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

  useEffect(() => {
    // Fetch debt data for the chart
    axios
      .get("http://localhost:5000/api/debt/show", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then((response) => {
        const debtData = Array.isArray(response.data) ? response.data : [];
        setDebts(debtData);
      })
      .catch((error) =>
        console.error("There was an error fetching the debts!", error)
      );
  }, []);

   useEffect(() => {
     // Fetch savings data for the chart
     axios
       .get("http://localhost:5000/api/savings/show", {
         headers: { "x-auth-token": localStorage.getItem("token") },
       })
       .then((response) => {
         const savingsData = Array.isArray(response.data) ? response.data : [];
         setSavings(savingsData);
       })
       .catch((error) =>
         console.error("There was an error fetching the savings!", error)
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
                  <h1>Welcome to the Dashboard</h1>
                  {auth.user && <p>Hello, {auth.user.username}</p>}
                  {/* Grid Layout for Income and Debt Charts */}
                  <div className="dashboard-grid">
                    <div className="chart-item">
                      <IncomeChart incomes={incomes} />
                    </div>
                    <div className="chart-item">
                      <DebtChart debts={debts} />
                    </div>
                  </div>
                    <div className="chart-item">
                      <SavingsChart savings={savings} />
                    </div>
                </div>
              }
            />
            <Route path="/inventorytracker" element={<InventoryManager />} />
            <Route path="/taskmanager" element={<TaskManager />} />
            <Route path="/financetracker" element={<FinanceTracker />} />
            <Route path="/family" element={<FamilyConnect />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
