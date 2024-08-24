import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
const IncomePage = () => {
  const [incomes, setIncomes] = useState([]);
  const [formData, setFormData] = useState({
    source: "",
    amount: 0,
    category: "",
  });
  const [editing, setEditing] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    // Fetch incomes from the API
    axios
      .get("http://localhost:5000/api/income/show", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then((response) => {
        const incomeData = Array.isArray(response.data) ? response.data : [];
        setIncomes(incomeData);
      })
      .catch((error) =>
        console.error("There was an error fetching the incomes!", error)
      );
  }, []);

  useEffect(() => {
    // Destroy the existing chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create a new chart instance
    if (chartRef.current) {
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

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [incomes]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editing
      ? `http://localhost:5000/api/income/update/${editing}`
      : "http://localhost:5000/api/income/add";
    axios
      .post(url, formData, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then((response) => {
        if (editing) {
          setIncomes(
            incomes.map((income) =>
              income._id === editing ? response.data : income
            )
          );
        } else {
          setIncomes([...incomes, response.data]);
        }
        setFormData({ source: "", amount: 0, category: "" });
        setEditing(null);
        setFormVisible(false);
      })
      .catch((error) =>
        console.error("There was an error processing the income!", error)
      );
  };

  const handleEdit = (income) => {
    setEditing(income._id);
    setFormData({
      source: income.source,
      amount: income.amount,
      category: income.category,
    });
    setFormVisible(true);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="header-custom">Your Incomes</h4>
        <button
          className="btn btn-primary rounded-pill mb-3"
          onClick={() => {
            setFormVisible(!formVisible);
            setEditing(null);
          }}
        >
          <FaPlus /> {formVisible ? "Cancel" : "Add Income"}
        </button>
      </div>

      {formVisible && (
        <form onSubmit={handleSubmit} className="mb-4">
          <h2>{editing ? "Edit Income" : "Add New Income"}</h2>
          <div className="form-group mb-3">
            <input
              type="text"
              name="source"
              className="form-control"
              placeholder="Source"
              value={formData.source}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="number"
              name="amount"
              className="form-control"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              name="category"
              className="form-control"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editing ? "Update Income" : "Add Income"}
          </button>
        </form>
      )}

      <h2>Income Visualization</h2>
      <div className="chart-container mb-4" style={{ height: "400px" }}>
        <canvas ref={chartRef}></canvas>
      </div>

      <h2>Income List</h2>
      <div className="row">
        {incomes.map((income) => (
          <div key={income._id} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{income.source}</h5>
                <p className="card-text">
                  <strong>Amount:</strong> ${income.amount}
                </p>
                <p className="card-text">
                  <strong>Category:</strong> {income.category}
                </p>
                <button
                  className="btn mr-2 mt-3"
                  onClick={() => handleEdit(income)}
                  style={{ background: "#17a2b8" }}
                >
                 <FaEdit />  Edit
                </button>
                <button
                  className="btn btn-danger ms-2 mt-3"
                  onClick={() => handleDelete(income._id)}
                >
                 <FaTrash />  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomePage;
