import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa"; // Import icons from react-icons
import "./TaskManager.css";
const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
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

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:5000/api/tasks/show", {
        headers: { "x-auth-token": token },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data);
    }
  };

  const handleAddTask = async () => {
    const token = localStorage.getItem("token");
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
    } catch (error) {
      console.error("Error adding task:", error.response?.data);
    }
  };

  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/tasks/delete/${id}`, {
        headers: { "x-auth-token": token },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error.response?.data);
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
    } catch (error) {
      console.error("Error updating task:", error.response?.data);
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

      {showForm && (
        <div className="card shadow-lg mb-4 p-4">
          <div className="card-body card-custom shadow-lg mb-4 p-4">
            <h4 className="header-custom text-center">
              {isEditing ? "Edit Task" : "Add New Task"}
            </h4>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Task Name"
                value={newTask.taskName}
                onChange={(e) =>
                  setNewTask({ ...newTask, taskName: e.target.value })
                }
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="date"
                className="form-control"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
              />
            </div>
            <div className="form-group mb-3">
              <select
                className="form-control"
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <select
                className="form-control"
                value={newTask.status}
                onChange={(e) =>
                  setNewTask({ ...newTask, status: e.target.value })
                }
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <button
              className="btn btn-primary btn-block btn-custom mb-2"
              onClick={isEditing ? handleUpdateTask : handleAddTask}
            >
              {isEditing ? "Update Task" : "Add Task"}
            </button>
            {isEditing && (
              <button
                className="btn btn-secondary btn-block btn-custom mb-2 ms-2"
                onClick={resetTaskForm}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      <div className="row">
        {["Pending", "In Progress", "Completed"].map((status) => (
          <div className="col-md-4 mb-4" key={status}>
            <div className="card card-custom shadow-lg h-100">
              <div className="card-header card-header-custom text-center bg-light">
                <h5 className="header-custom">{status}</h5>
              </div>
              <ul className="list-group list-group-flush">
                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <li
                      key={task._id}
                      className="list-group-item list-group-item-custom"
                    >
                      <h5 className="task-title">{task.taskName}</h5>
                      <p className="task-details">{task.description}</p>
                      <p className="task-details">
                        Due: {new Date(task.dueDate).toLocaleDateString()} |
                        Priority: {task.priority} | Status: {task.status}
                      </p>
                      <div className="task-actions">
                        <button
                          className="btn btn-edit-custom btn-sm"
                          onClick={() => handleEditTask(task)}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="btn btn-delete-custom btn-sm ms-2"
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </li>
                  ))}
                {tasks.filter((task) => task.status === status).length ===
                  0 && (
                  <li className="list-group-item list-group-item-custom text-center no-tasks">
                    No tasks in this category.
                  </li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
