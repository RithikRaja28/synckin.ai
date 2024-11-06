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
import EditIcon from "@mui/icons-material/Edit";


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
  const [openEditTaskDialog, setOpenEditTaskDialog] = useState(false); // For editing task
  const [openSavingsDialog, setOpenSavingsDialog] = useState(false);
  const [openEditSavingsDialog, setOpenEditSavingsDialog] = useState(false); 
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [task, setTask] = useState({ title: "", description: "", dueDate: "" });
  const [editTaskId, setEditTaskId] = useState(null);
  const [editSavingsId, setEditSavingsId] = useState(null); // Track the task being edited
  const[loading,setLoading]=useState(false);
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
    setLoading(true);
    try {
      const newTask = await axios.post(
        "http://localhost:5000/api/family-member-task/tasks",
        { ...task, assignedTo: selectedMember, familyId: family._id },
        { headers: { "x-auth-token": token } }
      );

      setTasks((prevTasks) => [...prevTasks, newTask.data]); // Optimistic update
      setSnackbar({
        open: true,
        message: "Task added successfully",
        type: "success",
      });
      setTask({ title: "", description: "", dueDate: "" });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error adding task - Check your Role (only Parent can Add) / Connectivity",
        type: "error",
      });
    } finally {
      setOpenTaskDialog(false);
      setLoading(false);
    }
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
        message:
          "Error adding savings - Check your Role (only Parent can Add) / Connectivity",
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

  const handleEditTask = (task) => {
    setTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
    });
    setEditTaskId(task._id);
    setOpenEditTaskDialog(true);
  };

  const handleUpdateTask = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/family-member-task/tasks/${editTaskId}`,
        task,
        { headers: { "x-auth-token": token } }
      );
      setSnackbar({
        open: true,
        message: "Task updated successfully",
        type: "success",
      });
      setTask({ title: "", description: "", dueDate: "" });
    } catch (err) {
      console.error("Error updating task:", err);
      setSnackbar({
        open: true,
        message: "Error updating task",
        type: "error",
      });
    }
    
    setOpenEditTaskDialog(false);
  };

  const handleDeleteTask = async (taskId) => {
    console.log("Deleting task with ID:", taskId); // Log task ID
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:5000/api/family-member-task/tasks/${taskId}`,
        {
          headers: { "x-auth-token": token },
        }
      );
      console.log("Task deleted successfully"); // Log success
      setTasks(tasks.filter((task) => task._id !== taskId));
      setSnackbar({
        open: true,
        message: "Task deleted successfully",
        type: "success",
      });
    } catch (err) {
      console.error("Error deleting task:", err); // Log full error
      setSnackbar({
        open: true,
        message:
          "Error deleting task: " +
          (err.response ? err.response.data : err.message),
        type: "error",
      });
    }
  };




  

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

  const handleEditSavings = (saving) => {
    setSavings({
      goal: saving.goal,
      amount: saving.amount,
      targetDate: saving.targetDate,
    });
    setEditSavingsId(saving._id);
    setOpenEditSavingsDialog(true);
  };

  const handleUpdateSavings = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/family-member-savings/savings/${editSavingsId}`,
        savings,
        { headers: { "x-auth-token": token } }
      );
      setSnackbar({
        open: true,
        message: "Savings updated successfully",
        type: "success",
      });
      setSavings({ goal: "", amount: "", targetDate: "" });
    } catch (err) {
      console.error("Error updating savings:", err);
      setSnackbar({
        open: true,
        message: "Error updating savings",
        type: "error",
      });
    }

    setOpenEditSavingsDialog(false);
  };

  const handleDeleteSavings = async (savingsId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:5000/api/family-member-savings/savings/${savingsId}`,
        { headers: { "x-auth-token": token } }
      );
      setSavingsList(savingsList.filter((saving) => saving._id !== savingsId));
      setSnackbar({
        open: true,
        message: "Savings deleted successfully",
        type: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error deleting savings",
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
                {/* Add Edit and Delete Icons */}
                <Tooltip title="Edit Task">
                  <IconButton onClick={() => handleEditTask(task)}>
                    <EditIcon color="primary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Task">
                  <IconButton onClick={() => handleDeleteTask(task._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
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
                  secondary={`Amount: ${saving.amount}, Target Date: ${saving.targetDate}`}
                />
                {/* Add Edit and Delete Icons for Savings */}
                <Tooltip title="Edit Savings">
                  <IconButton onClick={() => handleEditSavings(saving)}>
                    <EditIcon color="primary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Savings">
                  <IconButton onClick={() => handleDeleteSavings(saving._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailsDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditTaskDialog}
        onClose={() => setOpenEditTaskDialog(false)}
      >
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
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
          <Button onClick={() => setOpenEditTaskDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateTask} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEditSavingsDialog}
        onClose={() => setOpenEditSavingsDialog(false)}
      >
        <DialogTitle>Edit Savings</DialogTitle>
        <DialogContent>
          <TextField
            label="Goal"
            value={savings.goal}
            onChange={(e) => setSavings({ ...savings, goal: e.target.value })}
          />
          <TextField
            label="Amount"
            value={savings.amount}
            onChange={(e) => setSavings({ ...savings, amount: e.target.value })}
          />
          <TextField
            label="Target Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={savings.targetDate}
            onChange={(e) =>
              setSavings({ ...savings, targetDate: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditSavingsDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateSavings}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default FamilyDetails;
