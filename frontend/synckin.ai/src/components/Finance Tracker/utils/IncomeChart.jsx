// IncomeChart.js
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const IncomeChart = ({ incomes }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (chartRef.current && incomes.length > 0) {
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: incomes.map((income) => income.source),
          datasets: [
            {
              label: "Income",
              data: incomes.map((income) => income.amount),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
    <div
      className="chart-container mb-4 p-3 bg-white rounded shadow"
      style={{ height: "400px" }}
    >
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default IncomeChart;
