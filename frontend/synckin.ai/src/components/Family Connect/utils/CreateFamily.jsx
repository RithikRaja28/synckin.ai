import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";

const CreateFamily = () => {
  const [familyName, setFamilyName] = useState("");
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });

  const handleCreate = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/family/create",
        { familyName },
        { headers: { "x-auth-token": token } }
      );
      setSnackbar({
        open: true,
        message: "Family created successfully!",
        type: "success",
      });
      setOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error creating family!",
        type: "error",
      });
    }
  };

  const handleCloseSnackbar = () =>
    setSnackbar({ open: false, message: "", type: "" });

  return (
    <div className="text-center mb-3">
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Create Family
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create a Family</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a name for your family group.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Family Name"
            type="text"
            fullWidth
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Create
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

export default CreateFamily;
