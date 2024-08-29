import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
const Debt = () => {
  const [debts, setDebts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
    interestRate: 0,
    dueDate: "",
    minimumPayment: 0,
    isInterestApplicable: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchDebts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/debt/show", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });

      setDebts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setDebts([]);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isEditing
        ? `http://localhost:5000/api/debt/update/${editId}`
        : "http://localhost:5000/api/debt/add";
      const method = isEditing ? "put" : "post";
      await axios[method](endpoint, formData, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setFormData({
        name: "",
        amount: 0,
        interestRate: 0,
        dueDate: "",
        minimumPayment: 0,
        isInterestApplicable: false,
      });
      setIsEditing(false);
      setEditId(null);
      fetchDebts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (debt) => {
    setFormData(debt);
    setIsEditing(true);
    setEditId(debt._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/debt/delete/${id}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      fetchDebts();
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      currencyDisplay: "symbol",
    }).format(amount);
  };

  // Calculate chart data
  const chartData = {
    labels: debts.map((debt) => debt.name),
    datasets: [
      {
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
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <h2 className="mb-4">{isEditing ? "Edit Debt" : "Add Debt"}</h2>
          <form
            onSubmit={handleSubmit}
            className="bg-light p-4 rounded shadow-sm"
          >
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Amount:</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Due Date:</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Minimum Payment:</label>
              <input
                type="number"
                name="minimumPayment"
                value={formData.minimumPayment}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group form-check">
              <label>
                <input
                  type="checkbox"
                  name="isInterestApplicable"
                  checked={formData.isInterestApplicable}
                  onChange={handleInputChange}
                  className="form-check-input"
                />
                Is Interest Applicable?
              </label>
            </div>
            {formData.isInterestApplicable && (
              <>
                <div className="form-group">
                  <label>Interest Rate (%):</label>
                  <input
                    type="number"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Total Amount:</label>
                  <input
                    type="number"
                    value={formatCurrency(
                      parseFloat(formData.amount) +
                        parseFloat(formData.amount) *
                          (parseFloat(formData.interestRate) / 100)
                    )}
                    readOnly
                    className="form-control"
                  />
                </div>
              </>
            )}
            <button type="submit" className="btn btn-primary mt-3">
              {isEditing ? "Update Debt" : "Add Debt"}
            </button>
          </form>
        </div>

        <div className="col-md-6">
          <h2 className="mb-4">Debt Distribution</h2>
          <div className="bg-light p-4 rounded shadow-sm">
            <Pie data={chartData} />
          </div>
        </div>
      </div>

      <h2 className="mt-5">Existing Debts</h2>
      <div className="row">
        {debts.map((debt) => (
          <div className="col-md-4 mb-4" key={debt._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{debt.name}</h5>
                <p className="card-text">
                  Amount: {formatCurrency(debt.amount)}
                </p>
                {debt.isInterestApplicable && (
                  <>
                    <p className="card-text">
                      Interest Rate: {debt.interestRate}%
                    </p>
                    <p className="card-text">
                      Total Amount:{" "}
                      {formatCurrency(
                        parseFloat(debt.amount) +
                          parseFloat(debt.amount) *
                            (parseFloat(debt.interestRate) / 100)
                      )}
                    </p>
                  </>
                )}
                <p className="card-text">
                  Due Date: {new Date(debt.dueDate).toLocaleDateString()}
                </p>
                <div className="d-flex justify-content-between">
                  <button
                    onClick={() => handleEdit(debt)}
                    className="btn"
                    style={{ backgroundColor: "#17a2b8", color: "white" }}
                  >
                   <FaEdit/> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(debt._id)}
                    className="btn btn-danger"
                  >
                   <FaTrash/> Delete
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

export default Debt;
