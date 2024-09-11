import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const SavingsChart = ({ savings }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (chartRef.current && savings.length > 0) {
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: savings.map((saving) => saving.goal),
          datasets: [
            {
              label: "Current Amount",
              data: savings.map((saving) => saving.currentAmount),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
              label: "Target Amount",
              data: savings.map((saving) => saving.targetAmount),
              backgroundColor: "rgba(153, 102, 255, 0.6)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return "₹" + new Intl.NumberFormat().format(value);
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [savings]);

  return (
    <div
      className="chart-container mb-4 p-3 bg-white rounded shadow"
      style={{ height: "400px" }}
    >
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default SavingsChart;
