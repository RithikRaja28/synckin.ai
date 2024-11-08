import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpenseChart from "../Finance Tracker/utils/ExpenseChart"; // Chart component for expenses

const ExpensePage = ({ onExpenseDataUpdate }) => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    amount: 0,
    description: "",
  });
  const [editing, setEditing] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/expense/show", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then((response) => {
        const expenseData = Array.isArray(response.data) ? response.data : [];
        setExpenses(expenseData);
        onExpenseDataUpdate(expenseData); // Notify Dashboard of initial data
      })
      .catch((error) =>
        console.error("There was an error fetching the expenses!", error)
      );
  }, [onExpenseDataUpdate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editing
      ? `http://localhost:5000/api/expense/update/${editing}`
      : "http://localhost:5000/api/expense/add";
    const method = editing ? "put" : "post";
    axios[method](url, formData, {
      headers: { "x-auth-token": localStorage.getItem("token") },
    })
      .then((response) => {
        if (editing) {
          setExpenses(
            expenses.map((expense) =>
              expense._id === editing ? response.data : expense
            )
          );
        } else {
          setExpenses([...expenses, response.data]);
        }
        setFormData({
          category: "",
          subcategory: "",
          amount: 0,
          description: "",
        });
        setEditing(null);
        setFormVisible(false);
        onExpenseDataUpdate([...expenses, response.data]); // Update Dashboard with new data
      })
      .catch((error) =>
        console.error("There was an error processing the expense!", error)
      );
  };

  const handleEdit = (expense) => {
    setEditing(expense._id);
    setFormData({
      category: expense.category,
      subcategory: expense.subcategory || "",
      amount: expense.amount,
      description: expense.description || "",
    });
    setFormVisible(true);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/expense/delete/${id}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then(() => {
        const updatedExpenses = expenses.filter(
          (expense) => expense._id !== id
        );
        setExpenses(updatedExpenses);
        onExpenseDataUpdate(updatedExpenses); // Update Dashboard with new data
      })
      .catch((error) =>
        console.error("There was an error deleting the expense!", error)
      );
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Typography variant="h4" className="header-custom">
          Your Expenses
        </Typography>
        <Button
          variant="contained"
          startIcon={formVisible ? <FaPlus /> : <AddCircleIcon />}
          onClick={() => {
            setFormVisible(!formVisible);
            setEditing(null);
          }}
          color="primary"
          style={{ borderRadius: "20px", padding: "8px 16px" }}
        >
          {formVisible ? "Cancel" : "Add Expense"}
        </Button>
      </div>

      {formVisible && (
        <Card className="mb-5 shadow-sm" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {editing ? "Edit Expense" : "Add New Expense"}
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Category"
                name="category"
                fullWidth
                margin="normal"
                value={formData.category}
                onChange={handleChange}
                required
              />
              <TextField
                label="Subcategory"
                name="subcategory"
                fullWidth
                margin="normal"
                value={formData.subcategory}
                onChange={handleChange}
              />
              <TextField
                label="Amount"
                name="amount"
                fullWidth
                margin="normal"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
              />
              <TextField
                label="Description"
                name="description"
                fullWidth
                margin="normal"
                value={formData.description}
                onChange={handleChange}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2, borderRadius: "20px" }}
              >
                {editing ? "Update Expense" : "Add Expense"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <ExpenseChart expenses={expenses} />

      <Typography variant="h5" className="mb-4">
        Expense List
      </Typography>
      <Grid container spacing={3}>
        {expenses.map((expense) => (
          <Grid item xs={12} sm={6} md={4} key={expense._id}>
            <Card className="shadow-sm" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6">{expense.category}</Typography>
                <Typography>
                  Subcategory: {expense.subcategory || "N/A"}
                </Typography>
                <Typography>Amount: ₹{expense.amount}</Typography>
                <Typography>
                  Description: {expense.description || "N/A"}
                </Typography>
                <div className="mt-3 d-flex justify-content-between">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(expense)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(expense._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ExpensePage;
