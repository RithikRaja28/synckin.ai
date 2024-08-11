import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./utils/Sidebar";
import Header from "./utils/Header";
import ExpenseTracker from "../features/ExpenseTracker";
import "./Dashboard.css";

const Dashboard = () => {
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
            <Route path="/" element={<div>Welcome to the Dashboard</div>} />
            <Route
              path="/expenses"
              element={
                <ExpenseTracker />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
