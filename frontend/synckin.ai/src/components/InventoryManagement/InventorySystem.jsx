import React, { useState, useEffect } from "react";
import axios from "axios";

const InventoryManager = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    description: "",
    dueData: "",
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
      setNewItem({ name: "", quantity: "", description: "", dueData: "" });
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
      dueData: item.dueData,
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
      setNewItem({ name: "", quantity: "", description: "", dueData: "" });
      setIsEditing(false);
      setEditingItemId(null);
    } catch (error) {
      console.error("Error updating inventory item:", error.response.data);
    }
  };

  return (
    <div>
      <h2>Inventory Management</h2>
      <div>
        <h3>{isEditing ? "Edit Item" : "Add New Item"}</h3>
        <input
          type="text"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newItem.description}
          onChange={(e) =>
            setNewItem({ ...newItem, description: e.target.value })
          }
        />
        <input
          type="date"
          placeholder="Due Date"
          value={newItem.dueData}
          onChange={(e) => setNewItem({ ...newItem, dueData: e.target.value })}
        />
        <button onClick={isEditing ? handleUpdateItem : handleAddItem}>
          {isEditing ? "Update Item" : "Add Item"}
        </button>
      </div>
      <h3>Inventory Items</h3>
      <ul>
        {inventoryItems.map((item) => (
          <li key={item._id}>
            {item.name} - {item.quantity} - {item.description} - Due:{" "}
            {new Date(item.dueData).toLocaleDateString()}
            <button onClick={() => handleEditItem(item)}>Edit</button>
            <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryManager;
