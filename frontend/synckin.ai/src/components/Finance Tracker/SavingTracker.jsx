import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import SavingsChart from "./utils/SavingsChart"; // Import the separated chart component
import {
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Box,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";

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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          Your Savings Goals
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaPlus />}
          onClick={() => {
            setFormVisible(!formVisible);
            setEditing(null);
          }}
          style={{ borderRadius: "20px", padding: "8px 16px" }}
        >
          {formVisible ? "Cancel" : "Add Saving Goal"}
        </Button>
      </Box>

      {formVisible && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" mb={2}>
              {editing ? "Edit Saving Goal" : "Add New Saving Goal"}
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Target Amount"
                    name="targetAmount"
                    type="number"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Current Amount"
                    name="currentAmount"
                    type="number"
                    value={formData.currentAmount}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Target Date"
                    name="targetDate"
                    type="date"
                    value={formData.targetDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.hasInterestRate}
                        onChange={handleChange}
                        name="hasInterestRate"
                      />
                    }
                    label="Add Interest Rate"
                  />
                </Grid>
                {formData.hasInterestRate && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Interest Rate (%)"
                      name="interestRate"
                      type="number"
                      value={formData.interestRate}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      required
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="Monthly">Monthly</MenuItem>
                    <MenuItem value="Annually">Annually</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    {editing ? "Update Saving Goal" : "Add Saving Goal"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      )}

      <SavingsChart savings={savings} />

      <Typography variant="h5" gutterBottom className="mt-5 mb-3">
        Savings Goals List
      </Typography>
      <Grid container spacing={3}>
        {savings.map((saving) => (
          <Grid item key={saving._id} xs={12} sm={6} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {saving.goal}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Target Amount: ₹
                  {new Intl.NumberFormat().format(saving.targetAmount)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Current Amount: ₹
                  {new Intl.NumberFormat().format(saving.currentAmount)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Target Date:{" "}
                  {new Date(saving.targetDate).toLocaleDateString()}
                </Typography>
                {saving.interestRate > 0 && (
                  <Typography variant="body2" color="textSecondary">
                    Interest Rate: {saving.interestRate}%
                  </Typography>
                )}
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Frequency: {saving.frequency}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleEdit(saving)}
                  startIcon={<FaEdit />}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => handleDelete(saving._id)}
                  startIcon={<FaTrash />}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SavingsPage;
