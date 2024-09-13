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
                "#4E79A7", // Soft blue
                "#FF9DA7", // Soft pink
                "#EDC949", // Golden yellow
                "#59A14F", // Fresh green
                "#9C755F", // Earthy brown
                "#BAB0AC", // Neutral grey

              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  const value = context.raw;
                  return `INR ${value.toLocaleString("en-IN")}`;
                },
              },
            },
          },
        },
      });
    }
  }, [debts]);

  return <canvas ref={chartRef}></canvas>;
};

export default DebtChart;
