import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./utils/Sidebar";
import Header from "./utils/Header";
import "./Dashboard.css";
import { AuthContext } from "../../context/AuthContext";
import InventoryManager from "../InventoryManagement/InventorySystem";
import TaskManager from "../TaskManagement/TaskManager";
import FinanceTracker from "../Finance Tracker/FinanceTracker";
import IncomeChart from "../Finance Tracker/utils/IncomeChart";
import DebtChart from "../Finance Tracker/utils/DebtChart"; // Import the DebtChart
import axios from "axios";
import SavingsChart from "../Finance Tracker/utils/SavingsChart";
import FamilyConnect from "../Family Connect/FamilyConnect";
import { Grid, Paper } from "@mui/material"; // Import Grid for layout
import DashboardCard from "./utils/DashboardCard";
import ProfileDashboard from "../Profile/ProfileDashboard";
import SettingsPage from "../Setting Page/SettingsPage";
import ExpenseChart from "../Finance Tracker/utils/ExpenseChart";

const Dashboard = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [incomes, setIncomes] = useState([]);
  const [debts, setDebts] = useState([]); // State for debts
  const [savings, setSavings] = useState([]);
  const [expense, setExpense]= useState([]);
  const [showProfile, setShowProfile] = useState(false); // Track profile page

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

   useEffect(() => {
     // Fetch income data for the chart
     axios
       .get("http://localhost:5000/api/expense/show", {
         headers: { "x-auth-token": localStorage.getItem("token") },
       })
       .then((response) => {
         const expenseData = Array.isArray(response.data) ? response.data : [];
         setExpense(expenseData);
       })
       .catch((error) =>
         console.error("There was an error fetching the incomes!", error)
       );
   }, []);

  // Handler to switch between main dashboard and profile
  const handleProfileClick = () => {
    setShowProfile(true); // Show profile dashboard
  };

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
        <Header onProfileClick={handleProfileClick} /> {/* Pass handler here */}
        <div className="content p-4">
          {showProfile ? (
            // Conditionally render ProfileDashboard
            <ProfileDashboard />
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <h1>Welcome to the Dashboard</h1>
                    {auth.user && <p>Hello, {auth.user.username}</p>}

                    {/* Responsive Grid Layout for the Charts */}
                    <Grid container spacing={3}>
                      {/* Income Chart (Left) */}
                      <Grid item xs={12} md={4}>
                        <Paper
                          elevation={3}
                          sx={{ padding: 2, height: "100%" }}
                        >
                          <IncomeChart incomes={incomes} />
                        </Paper>
                      </Grid>

                      {/* Debt Chart (Right) */}
                      <Grid item xs={12} md={4}>
                        <Paper
                          elevation={3}
                          sx={{ padding: 2, height: "100%" }}
                        >
                          <DebtChart debts={debts} />
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Paper
                          elevation={3}
                          sx={{ padding: 2, height: "100%" }}
                        >
                          <DashboardCard />
                        </Paper>
                      </Grid>
                      {/* Savings Chart (Full width below) */}
                      <Grid item xs={12}>
                        <Paper elevation={3} sx={{ padding: 2 }}>
                          <SavingsChart savings={savings} />
                        </Paper>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Paper
                          elevation={3}
                          sx={{ padding: 2, height: "100%" }}
                        >
                          <ExpenseChart expenses={expense} />
                        </Paper>
                      </Grid>
                    </Grid>
                  </div>
                }
              />
              <Route path="/inventorytracker" element={<InventoryManager />} />
              <Route path="/taskmanager" element={<TaskManager />} />
              <Route path="/financetracker" element={<FinanceTracker />} />
              <Route path="/family" element={<FamilyConnect />} />
              <Route path="/profile" element={<ProfileDashboard />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
