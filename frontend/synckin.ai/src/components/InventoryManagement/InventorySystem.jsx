import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { FaEdit, FaTrash, FaCalendarAlt, FaListUl } from "react-icons/fa";

const InventoryManager = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    description: "",
    dueDate: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/inventory/show",
        {
          headers: { "x-auth-token": token },
        }
      );
      setInventoryItems(response.data);
    } catch (error) {
      console.error("Error fetching inventory items:", error.response.data);
    }
  };

  const handleAddItem = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/inventory/add",
        newItem,
        {
          headers: { "x-auth-token": token },
        }
      );
      setInventoryItems([...inventoryItems, response.data]);
      setNewItem({ name: "", quantity: "", description: "", dueDate: "" });
    } catch (error) {
      console.error("Error adding inventory item:", error.response.data);
    }
  };

  const handleDeleteItem = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/inventory/delete/${id}`, {
        headers: { "x-auth-token": token },
      });
      setInventoryItems(inventoryItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting inventory item:", error.response.data);
    }
  };

  const handleEditItem = (item) => {
    setNewItem({
      name: item.name,
      quantity: item.quantity,
      description: item.description,
      dueDate: item.dueDate,
    });
    setEditingItemId(item._id);
    setIsEditing(true);
  };

  const handleUpdateItem = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://localhost:5000/api/inventory/update/${editingItemId}`,
        newItem,
        {
          headers: { "x-auth-token": token },
        }
      );
      setInventoryItems(
        inventoryItems.map((item) =>
          item._id === editingItemId ? response.data : item
        )
      );
      setNewItem({ name: "", quantity: "", description: "", dueDate: "" });
      setIsEditing(false);
      setEditingItemId(null);
    } catch (error) {
      console.error("Error updating inventory item:", error.response.data);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {/* Form Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              {isEditing ? "Edit Item" : "Add New Item"}
            </Typography>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              margin="normal"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              variant="outlined"
              margin="normal"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              margin="normal"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={newItem.dueDate}
              onChange={(e) =>
                setNewItem({ ...newItem, dueDate: e.target.value })
              }
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={isEditing ? handleUpdateItem : handleAddItem}
            >
              {isEditing ? "Update Item" : "Add Item"}
            </Button>
          </Paper>
        </Grid>

        {/* Inventory List Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Inventory Items
            </Typography>
            {inventoryItems.length === 0 ? (
              <Typography>No items available</Typography>
            ) : (
              inventoryItems.map((item) => (
                <Card key={item._id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <Typography variant="h6">
                        <strong>{item.name}</strong>
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <FaListUl style={{ marginRight: 4 }} />
                        {item.quantity} items
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <FaCalendarAlt style={{ marginRight: 4 }} />
                        Due: {new Date(item.dueDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.description}
                      </Typography>
                    </div>
                    <div>
                      <IconButton
                        color="info"
                        onClick={() => handleEditItem(item)}
                      >
                        <FaEdit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteItem(item._id)}
                      >
                        <FaTrash />
                      </IconButton>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default InventoryManager;
