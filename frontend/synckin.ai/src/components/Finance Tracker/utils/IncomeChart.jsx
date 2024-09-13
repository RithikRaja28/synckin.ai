import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Typography, Paper } from "@mui/material";

const IncomeChart = ({ incomes }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (chartRef.current && incomes.length > 0) {
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "bar", // You can change this to 'pie', 'doughnut', etc., if needed
        data: {
          labels: incomes.map((income) => income.source),
          datasets: [
            {
              label: "Income Amount (₹)",
              data: incomes.map((income) => income.amount),
              backgroundColor: [
                "#4CAF50", // Green
                "#FF9800", // Orange
                "#2196F3", // Blue
                "#E91E63", // Pink
                "#9C27B0", // Purple
                "#00BCD4", // Cyan
                "#FFC107", // Yellow
              ],
              borderColor: [
                "#388E3C", // Dark Green
                "#F57C00", // Dark Orange
                "#1976D2", // Dark Blue
                "#C2185B", // Dark Pink
                "#7B1FA2", // Dark Purple
                "#00838F", // Dark Cyan
                "#FFA000", // Dark Yellow
              ],
              borderWidth: 1,
              hoverBackgroundColor: "#FFC107",
              hoverBorderColor: "#FF6F00",
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
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              titleFont: { size: 14, weight: "bold" },
              bodyFont: { size: 12 },
              bodySpacing: 8,
              padding: 10,
              cornerRadius: 8,
              caretSize: 8,
            },
          },
          scales: {
            x: {
              grid: {
                display: false, // Remove x-axis gridlines for a cleaner look
              },
              ticks: {
                font: {
                  size: 12,
                },
                color: "#666",
              },
            },
            y: {
              grid: {
                borderDash: [6, 4],
                color: "#e0e0e0", // Light grey dashed lines
              },
              ticks: {
                beginAtZero: true,
                font: {
                  size: 12,
                },
                color: "#666",
              },
            },
          },
          animation: {
            duration: 1200,
            easing: "easeOutQuart",
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [incomes]);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        borderRadius: 3,
        marginBottom: 4,
        backgroundColor: "#fafafa",
      }}
    >
      <div
        className="chart-container"
        style={{
          height: "400px",
          position: "relative",
        }}
      >
        <canvas ref={chartRef}></canvas>
      </div>
    </Paper>
  );
};

export default IncomeChart;
