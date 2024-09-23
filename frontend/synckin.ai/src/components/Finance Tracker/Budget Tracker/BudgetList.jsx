import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert,
  Box,
} from "@mui/material";
import BudgetForm from "./BudgetForm";
import ProgressBar from "./ProgressBar";
import BudgetChart from "./BudgetChart";
import { getBudgets, deleteBudget, getBudgetProgress } from "./api";
import { Typography } from "@mui/material";

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
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Budgets
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowForm(true)}
      >
        Add Budget
      </Button>
      {alert && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {alert}
        </Alert>
      )}
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Amount (₹)</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgets.map((budget) => (
              <TableRow key={budget._id}>
                <TableCell>{budget.name}</TableCell>
                <TableCell>₹{budget.amount}</TableCell>
                <TableCell>{budget.duration}</TableCell>
                <TableCell>
                  <ProgressBar
                    budget={budget}
                    onProgressCheck={handleProgressCheck}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => handleEdit(budget)}
                    sx={{ marginRight: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(budget._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <BudgetChart budgets={budgets} />
      <BudgetForm
        show={showForm}
        handleClose={() => {
          setShowForm(false);
          setSelectedBudget(null);
        }}
        existingBudget={selectedBudget}
        refreshBudgets={refreshBudgets}
      />
    </Box>
  );
};

export default BudgetList;
