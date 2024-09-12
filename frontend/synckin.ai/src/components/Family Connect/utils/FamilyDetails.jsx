import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import DeleteIcon from "@mui/icons-material/Delete";

const FamilyDetails = () => {
  const [family, setFamily] = useState(null);
  const [error, setError] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });

  // Fetch family details
  const fetchFamily = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/family/show",
        {
          headers: { "x-auth-token": token },
        }
      );
      setFamily(response.data);
      setError("");
    } catch (err) {
      setError("Error fetching family details.");
    }
  };

  // Handle delete family
  const handleDeleteFamily = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete("http://localhost:5000/api/family/delete", {
        headers: { "x-auth-token": token },
      });
      setSnackbar({
        open: true,
        message: "Family deleted successfully",
        type: "success",
      });
      setFamily(null); // Clear family from state after deletion
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error deleting family",
        type: "error",
      });
    }
    setOpenDeleteDialog(false);
  };

  useEffect(() => {
    fetchFamily();
  }, []);

  // Handle opening and closing delete dialog
  const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

  // Handle closing the snackbar
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  if (error) {
    return <div>{error}</div>;
  }

  if (!family) {
    return <div>Loading family details...</div>;
  }

  return (
    <div>
      <Card sx={{ marginTop: 2 }}>
        <CardContent>
          <Typography variant="h5">Family: {family.familyName}</Typography>
          <Typography variant="h6">Members:</Typography>
          <List>
            {family.members.map((member) => (
              <ListItem key={member.userId._id}>
                <ListItemAvatar>
                  <Avatar>
                    <GroupIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${member.userId.username}`}
                  secondary={`Role: ${member.role}`}
                />
              </ListItem>
            ))}
          </List>

          {/* Delete Family Button (Visible to Parent only) */}
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleOpenDeleteDialog}
            sx={{ marginTop: 2 }}
          >
            Delete Family
          </Button>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Family</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this family? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteFamily}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={snackbar.type}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default FamilyDetails;
