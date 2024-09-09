// SavingsPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import SavingsChart from "./utils/SavingsChart"; // Import the separated chart component

const SavingsPage = () => {
  const [savings, setSavings] = useState([]);
  const [formData, setFormData] = useState({
    goal: "",
    targetAmount: 0,
    currentAmount: 0,
    targetDate: "",
    interestRate: 0,
    frequency: "Annually",
    hasInterestRate: false,
  });
  const [editing, setEditing] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/savings/show", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then((response) => {
        const savingsData = Array.isArray(response.data) ? response.data : [];
        setSavings(savingsData);
      })
      .catch((error) =>
        console.error("There was an error fetching the savings!", error)
      );
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editing
      ? `http://localhost:5000/api/savings/update/${editing}`
      : "http://localhost:5000/api/savings/add";
    const method = editing ? "put" : "post";
    axios[method](url, formData, {
      headers: { "x-auth-token": localStorage.getItem("token") },
    })
      .then((response) => {
        if (editing) {
          setSavings(
            savings.map((saving) =>
              saving._id === editing ? response.data : saving
            )
          );
        } else {
          setSavings([...savings, response.data]);
        }
        setFormData({
          goal: "",
          targetAmount: 0,
          currentAmount: 0,
          targetDate: "",
          interestRate: 0,
          frequency: "Annually",
          hasInterestRate: false,
        });
        setEditing(null);
        setFormVisible(false);
      })
      .catch((error) =>
        console.error("There was an error processing the saving!", error)
      );
  };

  const handleEdit = (saving) => {
    setEditing(saving._id);
    setFormData({
      goal: saving.goal,
      targetAmount: saving.targetAmount,
      currentAmount: saving.currentAmount,
      targetDate: saving.targetDate.split("T")[0],
      interestRate: saving.interestRate,
      frequency: saving.frequency,
      hasInterestRate: saving.interestRate > 0,
    });
    setFormVisible(true);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/savings/delete/${id}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then(() => {
        setSavings(savings.filter((saving) => saving._id !== id));
      })
      .catch((error) =>
        console.error("There was an error deleting the saving!", error)
      );
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="header-custom">Your Savings Goals</h4>
        <button
          className="btn btn-primary rounded-pill mb-3"
          onClick={() => {
            setFormVisible(!formVisible);
            setEditing(null);
          }}
        >
          <FaPlus /> {formVisible ? "Cancel" : "Add Saving Goal"}
        </button>
      </div>
      {formVisible && (
        <div className="card mb-5 shadow-sm rounded-3">
          <div className="card-body p-4">
            <h5 className="card-title mb-4">
              {editing ? "Edit Saving Goal" : "Add New Saving Goal"}
            </h5>
            <form onSubmit={handleSubmit}>{/* Form Inputs here */}</form>
          </div>
        </div>
      )}
      <h5 className="mb-4">Savings Goals Overview</h5>
      <SavingsChart savings={savings} />{" "}
      {/* Use the separated chart component */}
      <h5>Savings Goals List</h5>
      <div className="row">
        {savings.map((saving) => (
          <div key={saving._id} className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm rounded-3">
              <div className="card-body d-flex flex-column p-4">
                <h6 className="card-title">{saving.goal}</h6>
                <p className="card-text mb-1">
                  Target Amount: ₹
                  {new Intl.NumberFormat().format(saving.targetAmount)}
                </p>
                <p className="card-text mb-1">
                  Current Amount: ₹
                  {new Intl.NumberFormat().format(saving.currentAmount)}
                </p>
                <p className="card-text mb-1">
                  Target Date:{" "}
                  {new Date(saving.targetDate).toLocaleDateString()}
                </p>
                {saving.interestRate > 0 && (
                  <p className="card-text mb-1">
                    Interest Rate: {saving.interestRate}%
                  </p>
                )}
                <p className="card-text mb-4">Frequency: {saving.frequency}</p>
                <div className="mt-auto d-flex">
                  <button
                    className="btn mb-2 me-2"
                    style={{ backgroundColor: "#17a2b8", color: "white" }}
                    onClick={() => handleEdit(saving)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn btn-danger mb-2"
                    onClick={() => handleDelete(saving._id)}
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

export default SavingsPage;
