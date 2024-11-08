// BudgetChart.jsx

import React from "react";
import { Bar } from "react-chartjs-2";
import { Card } from "@mui/material"; // Add Card for a modern look

const BudgetChart = ({ budgets }) => {
  const chartData = {
    labels: budgets.map((budget) => budget.name),
    datasets: [
      {
        label: "Budget Amount",
        data: budgets.map((budget) => budget.amount),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Expenses",
        data: budgets.map(
          (budget) =>
            budget.expenses.reduce((acc, expense) => acc + expense.amount, 0) ||
            0
        ),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <Card sx={{ padding: 2, marginTop: 3 }}>
      <Bar data={chartData} />
    </Card>
  );
};

export default BudgetChart;
