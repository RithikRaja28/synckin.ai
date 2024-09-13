import React, { useState, useEffect } from "react";
import axios from "axios";
import DebtChart from "./utils/DebtChart"; // Import the DebtChart component
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
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

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={4}>
        {/* Debt Form */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ padding: 3, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom>
              {isEditing ? "Edit Debt" : "Add Debt"}
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Due Date"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Minimum Payment"
                name="minimumPayment"
                type="number"
                value={formData.minimumPayment}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="isInterestApplicable"
                    checked={formData.isInterestApplicable}
                    onChange={handleInputChange}
                  />
                }
                label="Is Interest Applicable?"
              />
              {formData.isInterestApplicable && (
                <>
                  <TextField
                    label="Interest Rate (%)"
                    name="interestRate"
                    type="number"
                    value={formData.interestRate}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Total Amount"
                    value={formatCurrency(
                      parseFloat(formData.amount) +
                        parseFloat(formData.amount) *
                          (parseFloat(formData.interestRate) / 100)
                    )}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={isEditing ? <FaEdit /> : <FaPlus />}
                sx={{ mt: 2 }}
              >
                {isEditing ? "Update Debt" : "Add Debt"}
              </Button>
            </form>
          </Card>
        </Grid>

        {/* Debt Chart */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ padding: 3, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom>
              Debt Distribution
            </Typography>
            <DebtChart debts={debts} />
          </Card>
        </Grid>
      </Grid>

      {/* Existing Debts List */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Existing Debts
        </Typography>
        <Grid container spacing={4}>
          {debts.map((debt) => (
            <Grid item xs={12} md={4} key={debt._id}>
              <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent>
                  <Typography variant="h6">{debt.name}</Typography>
                  <Typography>Amount: {formatCurrency(debt.amount)}</Typography>
                  {debt.isInterestApplicable && (
                    <>
                      <Typography>
                        Interest Rate: {debt.interestRate}%
                      </Typography>
                      <Typography>
                        Total Amount:{" "}
                        {formatCurrency(
                          parseFloat(debt.amount) +
                            parseFloat(debt.amount) *
                              (parseFloat(debt.interestRate) / 100)
                        )}
                      </Typography>
                    </>
                  )}
                  <Typography>
                    Due Date: {new Date(debt.dueDate).toLocaleDateString()}
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="info"
                      startIcon={<FaEdit />}
                      onClick={() => handleEdit(debt)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<FaTrash />}
                      onClick={() => handleDelete(debt._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Debt;
