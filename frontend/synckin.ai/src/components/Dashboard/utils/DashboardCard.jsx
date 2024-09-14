import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { FaCalendarAlt } from "react-icons/fa";

const DashboardCard = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [highPriorityTasks, setHighPriorityTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInventoryItems();
    fetchTasks();
  }, []);

  const fetchInventoryItems = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/inventory/show",
        {
          headers: { "x-auth-token": token },
        }
      );
      setInventoryItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/tasks/show", {
        headers: { "x-auth-token": token },
      });
      const filteredTasks = response.data.filter(
        (task) => task.priority === "High"
      );
      setHighPriorityTasks(filteredTasks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {loading ? (
            <div className="text-center">
              <CircularProgress />
            </div>
          ) : (
            <Card variant="outlined" sx={{ mb: 4, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Top Inventory Items
                </Typography>
                {inventoryItems.slice(0, 3).map((item) => (
                  <div key={item._id} className="mb-4">
                    <Typography variant="body1">
                      <strong>{item.name}</strong> - {item.quantity} items
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <FaCalendarAlt style={{ marginRight: 4 }} />
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">{item.description}</Typography>
                  </div>
                ))}

                <Typography
                  variant="h6"
                  color="secondary"
                  gutterBottom
                  sx={{ mt: 3 }}
                >
                  High Priority Tasks
                </Typography>
                {highPriorityTasks.length > 0 ? (
                  highPriorityTasks.slice(0, 3).map((task) => (
                    <div key={task._id} className="mb-4">
                      <Typography variant="body1">
                        <strong>{task.taskName}</strong> - {task.priority}{" "}
                        priority
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <FaCalendarAlt style={{ marginRight: 4 }} />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        {task.description}
                      </Typography>
                    </div>
                  ))
                ) : (
                  <Typography>No high priority tasks available.</Typography>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardCard;
