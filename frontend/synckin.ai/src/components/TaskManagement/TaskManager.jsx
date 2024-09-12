import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import "./TaskManager.css";

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
      const temporaryId = Date.now();
      const temporaryTask = { ...newTask, _id: temporaryId };
      setTasks([...tasks, temporaryTask]);

      const response = await axios.post(
        "http://localhost:5000/api/tasks/add",
        newTask,
        {
          headers: { "x-auth-token": token },
        }
      );
      setTasks(
        tasks.map((task) => (task._id === temporaryId ? response.data : task))
      );
      fetchTasks();
      resetTaskForm();
      setLoading(false);
    } catch (error) {
      setError("Failed to add task. Please try again.");
      setTasks(tasks.filter((task) => task._id !== temporaryId));
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setLoading(true);
    setError("");

    const originalTasks = tasks;
    setTasks(tasks.filter((task) => task._id !== id));

    try {
      await axios.delete(`http://localhost:5000/api/tasks/delete/${id}`, {
        headers: { "x-auth-token": token },
      });
      setLoading(false);
    } catch (error) {
      setError("Failed to delete task. Please try again.");
      setTasks(originalTasks);
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
    <div className="container-custom mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="header-custom">Your Tasks</h4>
        <button
          className="btn btn-primary btn-custom rounded-pill"
          onClick={() => setShowForm(!showForm)}
        >
          <FaPlus /> {showForm ? "Hide Form" : "Add Task"}
        </button>
      </div>

      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="card card-custom p-4 mb-4">
          <div className="form-group">
            <label>Task Name</label>
            <input
              type="text"
              className="form-control"
              value={newTask.taskName}
              onChange={(e) =>
                setNewTask({ ...newTask, taskName: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              className="form-control"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              className="form-control"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select
              className="form-control"
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              className="form-control"
              value={newTask.status}
              onChange={(e) =>
                setNewTask({ ...newTask, status: e.target.value })
              }
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <button
            className="btn btn-primary btn-custom rounded-pill"
            onClick={isEditing ? handleUpdateTask : handleAddTask}
          >
            {isEditing ? "Update Task" : "Add Task"}
          </button>
          <button
            className="btn btn-secondary btn-custom rounded-pill ml-2 mt-3"
            onClick={resetTaskForm}
          >
            Cancel
          </button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        
        <select
          className="form-control w-auto"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        
      </div>

      <ul className="list-unstyled">
        {filteredTasks.map((task) => (
          <li
            key={task._id}
            className="task-item d-flex justify-content-between align-items-center p-3"
          >
            <div>
              <h5 className="header-custom">{task.taskName}</h5>
              <p>{task.description}</p>
              <p className="small">
                Due: {new Date(task.dueDate).toLocaleDateString()} | Priority:{" "}
                {task.priority} | Status: {task.status}
              </p>
            </div>
            <div>
              <button
                className="btn btn-warning btn-sm btn-custom mr-2"
                onClick={() => handleEditTask(task)}
              >
                <FaEdit />
              </button>
              <button
                className="btn btn-danger btn-sm btn-custom ms-3"
                onClick={() => handleDeleteTask(task._id)}
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
