import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaMoneyBillWave,
  FaPiggyBank,
  FaShoppingCart,
  FaHandHoldingUsd,
} from "react-icons/fa";
import IncomePage from "./IncomePage"; // Assuming this is your Income component
import DebtTracker from "./DebtTracker";
import SavingsTracker from "./SavingTracker";
// Import other components like SavingsPage, ExpensePage, DebtPage

const FinanceTracker = () => {
  const [activeSection, setActiveSection] = useState("income");

  const renderContent = () => {
    switch (activeSection) {
      case "income":
        return <IncomePage />;
      case "savings":
        return <SavingsTracker />; // Replace with SavingsPage component
      case "expense":
        return <IncomePage />; // Replace with ExpensePage component
      case "debt":
        return <DebtTracker />; // Replace with DebtPage component
      default:
        return <IncomePage />;
    }
  };

  return (
    <div
      className="container mt-2 p-4"
      
    >

      {/* Buttons on the top */}
      <div className="d-flex justify-content-around mb-5">
        <button
          className={`btn btn-light btn-lg ${
            activeSection === "income" ? "active btn-primary text-white" : ""
          }`}
          style={{ width: "150px", borderRadius: "30px" }}
          onClick={() => setActiveSection("income")}
        >
          <FaMoneyBillWave className="me-2" /> Income
        </button>
        <button
          className={`btn btn-light btn-lg ${
            activeSection === "savings" ? "active btn-primary text-white" : ""
          }`}
          style={{ width: "150px", borderRadius: "30px" }}
          onClick={() => setActiveSection("savings")}
        >
          <FaPiggyBank className="me-2" /> Savings
        </button>
        <button
          className={`btn btn-light btn-lg ${
            activeSection === "expense" ? "active btn-primary text-white" : ""
          }`}
          style={{ width: "150px", borderRadius: "30px" }}
          onClick={() => setActiveSection("expense")}
        >
          <FaShoppingCart className="me-2" /> Expense
        </button>
        <button
          className={`btn btn-light btn-lg ${
            activeSection === "debt" ? "active btn-primary text-white" : ""
          }`}
          style={{ width: "150px", borderRadius: "30px" }}
          onClick={() => setActiveSection("debt")}
        >
          <FaHandHoldingUsd className="me-2" /> Debt
        </button>
      </div>

      {/* Content rendering below the buttons */}
      <div
        className="card mb-4 p-4"
        style={{
          borderRadius: "10px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.05)",
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default FinanceTracker;
