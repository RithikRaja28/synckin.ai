import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IncomeChart from "../Finance Tracker/utils/IncomeChart"; // Import shared chart component

const IncomePage = ({ onIncomeDataUpdate }) => {
  const [incomes, setIncomes] = useState([]);
  const [formData, setFormData] = useState({
    source: "",
    amount: 0,
    category: "",
  });
  const [editing, setEditing] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/income/show", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then((response) => {
        const incomeData = Array.isArray(response.data) ? response.data : [];
        setIncomes(incomeData);
        onIncomeDataUpdate(incomeData); // Notify Dashboard of initial data
      })
      .catch((error) =>
        console.error("There was an error fetching the incomes!", error)
      );
  }, [onIncomeDataUpdate]);

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
        onIncomeDataUpdate([...incomes, response.data]); // Update Dashboard with new data
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
        const updatedIncomes = incomes.filter((income) => income._id !== id);
        setIncomes(updatedIncomes);
        onIncomeDataUpdate(updatedIncomes); // Update Dashboard with new data
      })
      .catch((error) =>
        console.error("There was an error deleting the income!", error)
      );
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Typography variant="h4" className="header-custom">
          Your Incomes
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
          {formVisible ? "Cancel" : "Add Income"}
        </Button>
      </div>

      {formVisible && (
        <Card className="mb-5 shadow-sm" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {editing ? "Edit Income" : "Add New Income"}
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Source"
                name="source"
                fullWidth
                margin="normal"
                value={formData.source}
                onChange={handleChange}
                required
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
                label="Category"
                name="category"
                fullWidth
                margin="normal"
                value={formData.category}
                onChange={handleChange}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2, borderRadius: "20px" }}
              >
                {editing ? "Update Income" : "Add Income"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <IncomeChart incomes={incomes} />

      <Typography variant="h5" className="mb-4">
        Income List
      </Typography>
      <Grid container spacing={3}>
        {incomes.map((income) => (
          <Grid item xs={12} sm={6} md={4} key={income._id}>
            <Card className="shadow-sm" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6">{income.source}</Typography>
                <Typography>Amount: ₹{income.amount}</Typography>
                <Typography>Category: {income.category}</Typography>
                <div className="mt-3 d-flex justify-content-between">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(income)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(income._id)}
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

export default IncomePage;
