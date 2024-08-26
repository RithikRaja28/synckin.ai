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
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

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
    const method = editing ? "put" : "post";
    axios[method](url, formData, {
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

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/income/delete/${id}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then(() => {
        setIncomes(incomes.filter((income) => income._id !== id));
      })
      .catch((error) =>
        console.error("There was an error deleting the income!", error)
      );
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
        <div className="card mb-5 shadow-sm rounded-3">
          <div className="card-body p-4">
            <h5 className="card-title mb-4">
              {editing ? "Edit Income" : "Add New Income"}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="source" className="form-label">
                  Source
                </label>
                <input
                  type="text"
                  id="source"
                  name="source"
                  className="form-control"
                  placeholder="Enter income source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="amount" className="form-label">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  className="form-control"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  className="form-control"
                  placeholder="Enter category"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4"
              >
                {editing ? "Update Income" : "Add Income"}
              </button>
            </form>
          </div>
        </div>
      )}

      <h5 className="mb-4">Income Visualization</h5>
      <div
        className="chart-container mb-4 p-3 bg-white rounded shadow"
        style={{ height: "400px" }}
      >
        <canvas ref={chartRef}></canvas>
      </div>

      <h5>Income List</h5>
      <div className="row">
        {incomes.map((income) => (
          <div key={income._id} className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm rounded-3">
              <div className="card-body d-flex flex-column p-4">
                <h6 className="card-title">{income.source}</h6>
                <p className="card-text mb-1">Amount: ${income.amount}</p>
                <p className="card-text mb-4">Category: {income.category}</p>
                <div className="mt-auto d-flex">
                  <button
                    className="btn mb-2 me-2"
                    style={{ backgroundColor: "#17a2b8", color: "white" }}
                    onClick={() => handleEdit(income)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn btn-danger mb-2"
                    onClick={() => handleDelete(income._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomePage;
