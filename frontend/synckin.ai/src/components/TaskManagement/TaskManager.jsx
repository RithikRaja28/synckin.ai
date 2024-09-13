import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Snackbar,
} from "@mui/material";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { styled } from "@mui/material/styles";

// Custom Styled Components
const StyledCard = styled(Card)({
  borderRadius: 15,
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
});

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    taskName: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, filterStatus]);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:5000/api/tasks/show", {
        headers: { "x-auth-token": token },
      });
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch tasks. Please try again later.");
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    const token = localStorage.getItem("token");

    if (!newTask.taskName || !newTask.dueDate) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/tasks/add",
        newTask,
        {
          headers: { "x-auth-token": token },
        }
      );
      setTasks([...tasks, response.data]);
      resetTaskForm();
      setSnackbarMessage("Task added successfully!");
      setSnackbarOpen(true);
      setLoading(false);
    } catch (error) {
      setError("Failed to add task. Please try again.");
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setLoading(true);
    setError("");

    try {
      await axios.delete(`http://localhost:5000/api/tasks/delete/${id}`, {
        headers: { "x-auth-token": token },
      });
      setTasks(tasks.filter((task) => task._id !== id));
      setSnackbarMessage("Task deleted successfully!");
      setSnackbarOpen(true);
      setLoading(false);
    } catch (error) {
      setError("Failed to delete task. Please try again.");
      setLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setNewTask({
      taskName: task.taskName,
      description: task.description,
      dueDate: task.dueDate?.slice(0, 10),
      priority: task.priority,
      status: task.status,
    });
    setEditingTaskId(task._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleUpdateTask = async () => {
    const token = localStorage.getItem("token");

    if (!newTask.taskName || !newTask.dueDate) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/update/${editingTaskId}`,
        newTask,
        {
          headers: { "x-auth-token": token },
        }
      );
      setTasks(
        tasks.map((task) => (task._id === editingTaskId ? response.data : task))
      );
      resetTaskForm();
      setSnackbarMessage("Task updated successfully!");
      setSnackbarOpen(true);
      setLoading(false);
    } catch (error) {
      setError("Failed to update task. Please try again.");
      setLoading(false);
    }
  };

  const resetTaskForm = () => {
    setNewTask({
      taskName: "",
      description: "",
      dueDate: "",
      priority: "Medium",
      status: "Pending",
    });
    setIsEditing(false);
    setEditingTaskId(null);
    setShowForm(false);
    setError("");
  };

  const filterTasks = () => {
    if (filterStatus === "All") {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter((task) => task.status === filterStatus));
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Typography variant="h4">Your Tasks</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowForm(!showForm)}
          startIcon={<FaPlus />}
        >
          {showForm ? "Hide Form" : "Add Task"}
        </Button>
      </div>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {showForm && (
        <StyledCard className="mb-4">
          <CardContent>
            <Typography variant="h6" className="mb-3">
              {isEditing ? "Edit Task" : "Add New Task"}
            </Typography>
            <TextField
              label="Task Name"
              fullWidth
              margin="normal"
              value={newTask.taskName}
              onChange={(e) =>
                setNewTask({ ...newTask, taskName: e.target.value })
              }
              required
            />
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            <TextField
              label="Due Date"
              type="date"
              fullWidth
              margin="normal"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
              required
              InputLabelProps={{ shrink: true }}
            />
            <Select
              fullWidth
              margin="normal"
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
              displayEmpty
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
            <Select
              fullWidth
              margin="normal"
              value={newTask.status}
              onChange={(e) =>
                setNewTask({ ...newTask, status: e.target.value })
              }
              displayEmpty
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={isEditing ? handleUpdateTask : handleAddTask}
              className="mt-3"
            >
              {isEditing ? "Update Task" : "Add Task"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={resetTaskForm}
              className="mt-2"
            >
              Cancel
            </Button>
          </CardContent>
        </StyledCard>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          displayEmpty
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
      </div>

      <ul className="list-unstyled">
        {filteredTasks.map((task) => (
          <StyledCard key={task._id} className="mb-3">
            <CardContent className="d-flex justify-content-between align-items-center">
              <div>
                <Typography variant="h6">{task.taskName}</Typography>
                <Typography variant="body2">{task.description}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Due: {new Date(task.dueDate).toLocaleDateString()} | Priority:{" "}
                  {task.priority} | Status: {task.status}
                </Typography>
              </div>
              <div>
                <IconButton
                  color="warning"
                  onClick={() => handleEditTask(task)}
                >
                  <FaEdit />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteTask(task._id)}
                >
                  <FaTrash />
                </IconButton>
              </div>
            </CardContent>
          </StyledCard>
        ))}
      </ul>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default TaskManager;
