import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { addBudget, updateBudget } from "./api";

const BudgetForm = ({ show, handleClose, existingBudget, refreshBudgets }) => {
  const [budget, setBudget] = useState(
    existingBudget || {
      name: "",
      amount: "",
      duration: "monthly",
      startDate: "",
      endDate: "",
    }
  );

  const handleChange = (e) => {
    setBudget({ ...budget, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existingBudget) {
      await updateBudget(existingBudget._id, budget);
    } else {
      await addBudget(budget);
    }
    refreshBudgets();
    handleClose();
  };

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{existingBudget ? "Edit" : "Add"} Budget</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Budget Name"
            name="name"
            value={budget.name}
            onChange={handleChange}
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="Amount"
            type="number"
            name="amount"
            value={budget.amount}
            onChange={handleChange}
            fullWidth
            margin="dense"
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Duration</InputLabel>
            <Select
              name="duration"
              value={budget.duration}
              onChange={handleChange}
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="annually">Annually</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Start Date"
            type="date"
            name="startDate"
            value={budget.startDate}
            onChange={handleChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="End Date"
            type="date"
            name="endDate"
            value={budget.endDate}
            onChange={handleChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            required
          />
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save Budget
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetForm;
