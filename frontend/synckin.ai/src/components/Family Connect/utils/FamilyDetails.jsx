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
  TextField,
  IconButton,
  Snackbar,
  Alert as MuiAlert,
  Tooltip,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

const FamilyDetails = () => {
  const [family, setFamily] = useState(null);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });
  const [selectedMember, setSelectedMember] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [savingsList, setSavingsList] = useState([]);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openSavingsDialog, setOpenSavingsDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [task, setTask] = useState({ title: "", description: "", dueDate: "" });
  const [savings, setSavings] = useState({
    goal: "",
    amount: "",
    targetDate: "",
  });

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

  useEffect(() => {
    fetchFamily();
  }, []);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const tasksResponse = await axios.get(
          `http://localhost:5000/api/family-member-task/tasks/${selectedMember}`,
          { headers: { "x-auth-token": token } }
        );
        const savingsResponse = await axios.get(
          `http://localhost:5000/api/family-member-savings/savings/${selectedMember}`,
          { headers: { "x-auth-token": token } }
        );
        setTasks(tasksResponse.data);
        setSavingsList(savingsResponse.data);
      } catch (error) {
        console.error("Error fetching member details:", error);
      }
    };

    if (selectedMember) {
      fetchMemberDetails();
    }
  }, [selectedMember]);

  const handleTaskDialogOpen = (memberId) => {
    setSelectedMember(memberId);
    setOpenTaskDialog(true);
  };

  const handleSavingsDialogOpen = (memberId) => {
    setSelectedMember(memberId);
    setOpenSavingsDialog(true);
  };

  const handleTaskDialogClose = () => setOpenTaskDialog(false);
  const handleSavingsDialogClose = () => setOpenSavingsDialog(false);

  const handleAddTask = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/family-member-task/tasks",
        { ...task, assignedTo: selectedMember, familyId: family._id },
        { headers: { "x-auth-token": token } }
      );
      setSnackbar({
        open: true,
        message: "Task added successfully",
        type: "success",
      });
      setTask({ title: "", description: "", dueDate: "" });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error adding task",
        type: "error",
      });
    }
    setOpenTaskDialog(false);
  };

  const handleAddSavings = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/family-member-savings/savings",
        { ...savings, assignedTo: selectedMember, familyId: family._id },
        { headers: { "x-auth-token": token } }
      );
      setSnackbar({
        open: true,
        message: "Savings added successfully",
        type: "success",
      });
      setSavings({ goal: "", amount: "", targetDate: "" });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error adding savings",
        type: "error",
      });
    }
    setOpenSavingsDialog(false);
  };

  const handleViewDetails = async (memberId) => {
    try {
      const token = localStorage.getItem("token");
      const tasksResponse = await axios.get(
        `http://localhost:5000/api/family-member-task/tasks/${memberId}`,
        {
          headers: { "x-auth-token": token },
        }
      );
      const savingsResponse = await axios.get(
        `http://localhost:5000/api/family-member-savings/savings/${memberId}`,
        {
          headers: { "x-auth-token": token },
        }
      );
      setTasks(tasksResponse.data);
      setSavingsList(savingsResponse.data);
      setSelectedMember(memberId);
      setOpenDetailsDialog(true);
    } catch (error) {
      console.error("Error fetching member details", error);
      setSnackbar({
        open: true,
        message: "Error fetching member details",
        type: "error",
      });
    }
  };

  const handleDetailsDialogClose = () => setOpenDetailsDialog(false);

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
      setFamily(null); // Reset the family data after deletion
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error deleting family",
        type: "error",
      });
    }
  };

  const handleRemoveMember = async (memberId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete("http://localhost:5000/api/family/remove-member", {
        headers: { "x-auth-token": token },
        data: { _id: memberId },
      });
      setSnackbar({
        open: true,
        message: "Member removed successfully",
        type: "success",
      });
      setFamily((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m.userId._id !== memberId),
      }));
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error removing member",
        type: "error",
      });
    }
  };

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
          <Typography className="d-inline" variant="h5">
            Family: {family.familyName}
          </Typography>
          <span>
            <Tooltip title="Delete Family">
              <IconButton
                color="error"
                variant="contained"
                onClick={handleDeleteFamily}
                className="mb-2 ms-4"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            {/* <Button
              variant="contained"
              color="secondary"
              className="rounded-pill ms-4 mb-1"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteFamily}
            ></Button> */}
          </span>
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Members:
          </Typography>
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
                <Tooltip title="Add Task">
                  <IconButton
                    color="primary"
                    onClick={() => handleTaskDialogOpen(member.userId._id)}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Add Savings">
                  <IconButton
                    color="secondary"
                    onClick={() => handleSavingsDialogOpen(member.userId._id)}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View Details">
                  <IconButton
                    color="info"
                    onClick={() => handleViewDetails(member.userId._id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remove Member">
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveMember(member.userId._id)}
                  >
                    <PersonRemoveIcon />
                  </IconButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Task Dialog */}
      <Dialog open={openTaskDialog} onClose={handleTaskDialogClose}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Task Title"
            fullWidth
            margin="normal"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
          />
          <TextField
            label="Due Date"
            type="date"
            fullWidth
            margin="normal"
            value={task.dueDate}
            onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTaskDialogClose}>Cancel</Button>
          <Button onClick={handleAddTask} color="primary">
            Add Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Savings Dialog */}
      <Dialog open={openSavingsDialog} onClose={handleSavingsDialogClose}>
        <DialogTitle>Add Savings</DialogTitle>
        <DialogContent>
          <TextField
            label="Savings Goal"
            fullWidth
            margin="normal"
            value={savings.goal}
            onChange={(e) => setSavings({ ...savings, goal: e.target.value })}
          />
          <TextField
            label="Amount"
            fullWidth
            margin="normal"
            value={savings.amount}
            onChange={(e) => setSavings({ ...savings, amount: e.target.value })}
          />
          <TextField
            label="Target Date"
            type="date"
            fullWidth
            margin="normal"
            value={savings.targetDate}
            onChange={(e) =>
              setSavings({ ...savings, targetDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSavingsDialogClose}>Cancel</Button>
          <Button onClick={handleAddSavings} color="primary">
            Add Savings
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={handleDetailsDialogClose}>
        <DialogTitle>Details</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Tasks:</Typography>
          <List>
            {tasks.map((task) => (
              <ListItem key={task._id}>
                <ListItemText primary={task.title} secondary={task.dueDate} />
              </ListItem>
            ))}
          </List>
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Savings:
          </Typography>
          <List>
            {savingsList.map((saving) => (
              <ListItem key={saving._id}>
                <ListItemText
                  primary={saving.goal}
                  secondary={saving.targetDate}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailsDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default FamilyDetails;
