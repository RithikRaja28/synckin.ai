import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const SavingsPage = () => {
  const [savings, setSavings] = useState([]);
  const [formData, setFormData] = useState({
    goal: "",
    targetAmount: 0,
    currentAmount: 0,
    targetDate: "",
    interestRate: 0,
    frequency: "Annually",
    hasInterestRate: false, // New field for toggling interest rate input
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
      targetDate: saving.targetDate.split("T")[0], // Format date for input
      interestRate: saving.interestRate,
      frequency: saving.frequency,
      hasInterestRate: saving.interestRate > 0, // Check if interest rate is present
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
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="goal" className="form-label">
                  Goal
                </label>
                <input
                  type="text"
                  id="goal"
                  name="goal"
                  className="form-control"
                  placeholder="Enter saving goal"
                  value={formData.goal}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="targetAmount" className="form-label">
                  Target Amount
                </label>
                <input
                  type="number"
                  id="targetAmount"
                  name="targetAmount"
                  className="form-control"
                  placeholder="Enter target amount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="currentAmount" className="form-label">
                  Current Amount
                </label>
                <input
                  type="number"
                  id="currentAmount"
                  name="currentAmount"
                  className="form-control"
                  placeholder="Enter current amount"
                  value={formData.currentAmount}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="targetDate" className="form-label">
                  Target Date
                </label>
                <input
                  type="date"
                  id="targetDate"
                  name="targetDate"
                  className="form-control"
                  value={formData.targetDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="checkbox"
                  id="hasInterestRate"
                  name="hasInterestRate"
                  className="form-check-input"
                  checked={formData.hasInterestRate}
                  onChange={handleChange}
                />
                <label
                  htmlFor="hasInterestRate"
                  className="form-check-label ms-2"
                >
                  Add Interest Rate
                </label>
              </div>
              {formData.hasInterestRate && (
                <div className="mb-3">
                  <label htmlFor="interestRate" className="form-label">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    id="interestRate"
                    name="interestRate"
                    className="form-control"
                    placeholder="Enter interest rate"
                    value={formData.interestRate}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                  />
                </div>
              )}
              <div className="mb-4">
                <label htmlFor="frequency" className="form-label">
                  Frequency
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  className="form-select"
                  value={formData.frequency}
                  onChange={handleChange}
                  required
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Annually">Annually</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4"
              >
                {editing ? "Update Saving Goal" : "Add Saving Goal"}
              </button>
            </form>
          </div>
        </div>
      )}

      <h5>Savings Goals List</h5>
      <div className="row">
        {savings.map((saving) => (
          <div key={saving._id} className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm rounded-3">
              <div className="card-body d-flex flex-column p-4">
                <h6 className="card-title">{saving.goal}</h6>
                <p className="card-text mb-1">
                  Target Amount: ${saving.targetAmount}
                </p>
                <p className="card-text mb-1">
                  Current Amount: ${saving.currentAmount}
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
