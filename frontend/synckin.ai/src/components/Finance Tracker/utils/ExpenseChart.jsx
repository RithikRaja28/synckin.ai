import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Paper } from "@mui/material";

const ExpenseChart = ({ expenses }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (chartRef.current && expenses.length > 0) {
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "line", // Change to 'pie' or 'doughnut' if needed
        data: {
          labels: expenses.map((expense) => expense.category),
          datasets: [
            {
              label: "Expense Amount (₹)",
              data: expenses.map((expense) => expense.amount),
              backgroundColor: [
                "#FF5733", // Red
                "#33FF57", // Green
                "#3357FF", // Blue
                "#FF33A5", // Pink
                "#8E44AD", // Purple
                "#3498DB", // Cyan
                "#F1C40F", // Yellow
              ],
              borderColor: [
                "#C70039", // Dark Red
                "#28B463", // Dark Green
                "#1F618D", // Dark Blue
                "#A93226", // Dark Pink
                "#6C3483", // Dark Purple
                "#1A5276", // Dark Cyan
                "#B7950B", // Dark Yellow
              ],
              borderWidth: 1,
              hoverBackgroundColor: "#FFB74D",
              hoverBorderColor: "#F57C00",
              borderRadius: 4,
              barPercentage: 0.7,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              labels: {
                font: {
                  size: 14,
                  weight: "bold",
                },
                color: "#333",
              },
            },
            tooltip: {
              backgroundColor: "#FFF",
              titleColor: "#000",
              bodyColor: "#000",
              displayColors: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `₹${value}`,
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        },
      });
    }
  }, [expenses]);

  return (
    <Paper
      elevation={3}
      sx={{
        height: "400px",
        padding: 3,
        borderRadius: "12px",
        overflow: "hidden",
        marginBottom: "30px",
      }}
    >
      <canvas ref={chartRef} />
    </Paper>
  );
};

export default ExpenseChart;
