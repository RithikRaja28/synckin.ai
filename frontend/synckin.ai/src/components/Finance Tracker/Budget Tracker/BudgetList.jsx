import React, { useState, useEffect } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import BudgetForm from "./BudgetForm";
import ProgressBar from "./ProgressBar";
import { getBudgets, deleteBudget, getBudgetProgress } from "./api";

const BudgetList = () => {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [alert, setAlert] = useState(null);

  const refreshBudgets = async () => {
    const data = await getBudgets();
    setBudgets(data);
  };

  useEffect(() => {
    refreshBudgets();
  }, []);

  const handleEdit = (budget) => {
    setSelectedBudget(budget);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await deleteBudget(id);
    refreshBudgets();
  };

  const handleProgressCheck = async (budget) => {
    const progressData = await getBudgetProgress(budget._id);
    if (progressData.progress >= 100) {
      setAlert(`Budget exceeded! Expenses: ₹${progressData.totalExpenses}`);
    } else {
      setAlert(null);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Budgets</h2>
      <Button onClick={() => setShowForm(true)}>Add Budget</Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Duration</th>
            <th>Progress</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => (
            <tr key={budget._id}>
              <td>{budget.name}</td>
              <td>₹{budget.amount}</td>
              <td>{budget.duration}</td>
              <td>
                <ProgressBar
                  budget={budget}
                  onProgressCheck={handleProgressCheck}
                />
              </td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(budget)}>
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(budget._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {alert && <Alert variant="danger">{alert}</Alert>}

      <BudgetForm
        show={showForm}
        handleClose={() => {
          setShowForm(false);
          setSelectedBudget(null);
        }}
        existingBudget={selectedBudget}
        refreshBudgets={refreshBudgets}
      />
    </div>
  );
};

export default BudgetList;
