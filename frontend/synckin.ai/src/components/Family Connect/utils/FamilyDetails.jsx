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
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

const FamilyDetails = () => {
  const [family, setFamily] = useState(null);
  const [error, setError] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRemoveMemberDialog, setOpenRemoveMemberDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
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
      setFamily(null);
       // Clear family from state after deletion
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error deleting family",
        type: "error",
      });
    }
    setOpenDeleteDialog(false);
  };

  // Handle remove member
  const handleRemoveMember = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete("http://localhost:5000/api/family/remove-member", {
        headers: { "x-auth-token": token },
        data: { _id: selectedMember }, // Send _id in the request body
      });
      setSnackbar({
        open: true,
        message: "Member removed successfully",
        type: "success",
      });
      fetchFamily(); // Refresh family details
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error removing member",
        type: "error",
      });
    }
    setOpenRemoveMemberDialog(false);
  };



  useEffect(() => {
    fetchFamily();
  }, []);

  // Handle opening and closing dialogs
  const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);
  const handleOpenRemoveMemberDialog = (memberId) => {
    setSelectedMember(memberId);
    setOpenRemoveMemberDialog(true);
  };
  const handleCloseRemoveMemberDialog = () => setOpenRemoveMemberDialog(false);

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
                {member.role !== "Parent" && (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<PersonRemoveIcon />}
                    onClick={() =>
                      handleOpenRemoveMemberDialog(member.userId._id)
                    }
                    sx={{ marginLeft: 2 }}
                  >
                    Remove
                  </Button>
                )}
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

      {/* Remove Member Confirmation Dialog */}
      <Dialog
        open={openRemoveMemberDialog}
        onClose={handleCloseRemoveMemberDialog}
      >
        <DialogTitle>Remove Member</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this member from the family? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRemoveMemberDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleRemoveMember}
            color="error"
            variant="contained"
          >
            Remove
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
