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
        console.log("Tasks API response:", tasksResponse.data);

        const savingsResponse = await axios.get(
          `http://localhost:5000/api/family-member-savings/savings/${selectedMember}`,
          { headers: { "x-auth-token": token } }
        );
        console.log("Savings API response:", savingsResponse.data);

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
      // Fetch tasks and savings for the selected member
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
      setOpenDetailsDialog(true); // Open the details modal
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
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={task.dueDate}
            onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTaskDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddTask} color="primary" variant="contained">
            Add Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Savings Dialog */}
      <Dialog open={openSavingsDialog} onClose={handleSavingsDialogClose}>
        <DialogTitle>Add Savings</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Savings Goal"
            fullWidth
            value={savings.goal}
            onChange={(e) => setSavings({ ...savings, goal: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Amount"
            fullWidth
            value={savings.amount}
            onChange={(e) => setSavings({ ...savings, amount: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Target Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={savings.targetDate}
            onChange={(e) =>
              setSavings({ ...savings, targetDate: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSavingsDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleAddSavings}
            color="primary"
            variant="contained"
          >
            Add Savings
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={handleDetailsDialogClose}>
        <DialogTitle>Member Details</DialogTitle>
        <DialogContent>
          <DialogContentText>Tasks</DialogContentText>
          {tasks.length > 0 ? (
            <List>
              {tasks.map((task) => (
                <ListItem key={task._id}>
                  <ListItemText
                    primary={task.title}
                    secondary={`Due: ${new Date(
                      task.dueDate
                    ).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No tasks assigned.</Typography>
          )}
          <DialogContentText>Savings</DialogContentText>
          {savingsList.length > 0 ? (
            <List>
              {savingsList.map((saving) => (
                <ListItem key={saving._id}>
                  <ListItemText
                    primary={saving.goal}
                    secondary={`Amount: ${saving.amount}, Target: ${new Date(
                      saving.targetDate
                    ).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No savings set.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailsDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
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
