import React from "react";
import { Bar } from "react-chartjs-2";
import { Box, Card, CardContent, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SavingsChart = ({ savings }) => {
  const chartData = {
    labels: savings.map((saving) => saving.goal),
    datasets: [
      {
        label: "Target Amount",
        data: savings.map((saving) => saving.targetAmount),
        backgroundColor: "#36A2EB",
        borderRadius: 5,
        borderWidth: 1,
        barThickness: 30,
      },
      {
        label: "Current Amount",
        data: savings.map((saving) => saving.currentAmount),
        backgroundColor: "#4CAF50",
        borderRadius: 5,
        borderWidth: 1,
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: "#e0e0e0",
          lineWidth: 1,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuad",
    },
  };

  return (
    <Card sx={{ mt: 4, p: 2, boxShadow: 3, borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ height: { xs: "250px", sm: "400px" } }}>
          <Bar data={chartData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SavingsChart;
