import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";

const AddFamilyMember = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("Parent");
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });

  const addFamilyMember = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/family/add-member",
        { username, role },
        { headers: { "x-auth-token": token } }
      );
      setSnackbar({
        open: true,
        message: "Member added successfully!",
        type: "success",
      });
      setOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error adding member!",
        type: "error",
      });
    }
  };

  const handleCloseSnackbar = () =>
    setSnackbar({ open: false, message: "", type: "" });

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add Family Member
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Family Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
            margin="dense"
          >
            <MenuItem value="Parent">Parent</MenuItem>
            <MenuItem value="Children">Children</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={addFamilyMember} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.type}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddFamilyMember;
