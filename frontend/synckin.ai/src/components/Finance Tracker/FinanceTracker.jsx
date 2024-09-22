import React, { useState } from "react";
import { Container, Paper, Tabs, Tab, Grid } from "@mui/material";
import {
  FaMoneyBillWave,
  FaPiggyBank,
  FaShoppingCart,
  FaHandHoldingUsd,
} from "react-icons/fa";
import IncomePage from "./IncomePage";
import DebtTracker from "./DebtTracker";
import SavingsTracker from "./SavingTracker";
import ExpensePage from "./ExpenseTracker";

const FinanceTracker = () => {
  const [activeSection, setActiveSection] = useState("income");

  const renderContent = () => {
    switch (activeSection) {
      case "income":
        return <IncomePage />;
      case "expense":
        return <ExpensePage />; // Replace with ExpensePage component
      case "savings":
        return <SavingsTracker />; // Replace with SavingsPage component
      case "debt":
        return <DebtTracker />; // Replace with DebtPage component
      default:
        return <IncomePage />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Tabs for section navigation */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: "16px",
          mb: 4,
          p: 2,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Tabs
          value={activeSection}
          onChange={(event, newValue) => setActiveSection(newValue)}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
          aria-label="Finance Tracker Tabs"
        >
          <Tab
            value="income"
            label={
              <>
                <FaMoneyBillWave style={{ marginRight: 8 }} /> Income
              </>
            }
            sx={{ fontWeight: "bold", fontSize: { xs: "12px", sm: "16px" } }}
          />
          <Tab
            value="expense"
            label={
              <>
                <FaShoppingCart style={{ marginRight: 8 }} /> Expense
              </>
            }
            sx={{ fontWeight: "bold", fontSize: { xs: "12px", sm: "16px" } }}
          />
          <Tab
            value="savings"
            label={
              <>
                <FaPiggyBank style={{ marginRight: 8 }} /> Savings
              </>
            }
            sx={{ fontWeight: "bold", fontSize: { xs: "12px", sm: "16px" } }}
          />
          <Tab
            value="debt"
            label={
              <>
                <FaHandHoldingUsd style={{ marginRight: 8 }} /> Debt
              </>
            }
            sx={{ fontWeight: "bold", fontSize: { xs: "12px", sm: "16px" } }}
          />
        </Tabs>
      </Paper>

      {/* Content rendering below the tabs */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: "16px",
          p: { xs: 2, sm: 4 },
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {renderContent()}
      </Paper>
    </Container>
  );
};

export default FinanceTracker;
