import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const DebtChart = ({ debts }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (chartRef.current && debts.length > 0) {
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "pie", // You can change this to 'bar' or any other chart type
        data: {
          labels: debts.map((debt) => debt.name),
          datasets: [
            {
              label: "Debt Amount",
              data: debts.map((debt) => debt.amount),
              backgroundColor: [
                "#007bff",
                "#28a745",
                "#ffc107",
                "#dc3545",
                "#17a2b8",
              ],
              hoverBackgroundColor: [
                "#0056b3",
                "#19692c",
                "#e0a800",
                "#b21f2d",
                "#117a8b",
              ],
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
  }, [debts]);

  return (
    <div
      className="chart-container mb-4 p-3 bg-white rounded shadow"
      style={{ height: "400px" }}
    >
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default DebtChart;
