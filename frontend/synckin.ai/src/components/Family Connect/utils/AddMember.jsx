import React, { useState, useEffect } from "react";
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
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

const AddFamilyMember = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("Parent");
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Debouncing: Avoid frequent API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        fetchUserSuggestions(searchQuery);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchUserSuggestions = async (query) => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/family/search",
        {
          params: { query },
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      setOptions(response.data);
    } catch (error) {
      console.error(
        "Error fetching user suggestions:",
        error.response ? error.response.data : error.message
      );
    }
    setLoading(false);
  };

  const addFamilyMember = async () => {
    const token = localStorage.getItem("token");
    try {
      console.log(
        "Sending invitation with username:",
        username,
        "and role:",
        role
      );
      const response = await axios.post(
        "http://localhost:5000/api/family/add-member",
        { username, role },
        { headers: { "x-auth-token": token } }
      );
      console.log("Invitation response:", response.data);
      setSnackbar({
        open: true,
        message: "Invitation sent successfully! Check your email.",
        type: "success",
      });
      setOpen(false);
    } catch (error) {
      console.error(
        "Error sending invitation:",
        error.response ? error.response.data : error.message
      );
      setSnackbar({
        open: true,
        message: "Error sending invitation!",
        type: "error",
      });
    }
  };

  const handleCloseSnackbar = () =>
    setSnackbar({ open: false, message: "", type: "" });

  return (
    <div className="text-center">
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        className="mb-3"
      >
        Add Family Member
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Add Family Member</DialogTitle>
        <DialogContent>
          <Autocomplete
            freeSolo
            options={options.map((option) => option.username)}
            loading={loading}
            onInputChange={(e, value) => {
              setSearchQuery(value);
            }}
            onChange={(e, value) => {
              if (value) {
                setUsername(value);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Username"
                margin="dense"
                fullWidth
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  setUsername(value);
                  console.log("Username:", value);
                }}
              />
            )}
          />

          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
            margin="dense"
            className="mt-3"
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
