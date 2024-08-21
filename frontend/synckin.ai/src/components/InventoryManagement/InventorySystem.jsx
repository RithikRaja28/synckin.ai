import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrash } from "react-icons/fa";
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
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-lg mb-4">
            <div className="card-body">
              <h4 className="text-muted">
                {isEditing ? "Edit Item" : "Add New Item"}
              </h4>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Quantity"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantity: e.target.value })
                  }
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="date"
                  className="form-control"
                  value={newItem.dueDate}
                  onChange={(e) =>
                    setNewItem({ ...newItem, dueDate: e.target.value })
                  }
                />
              </div>
              <button
                className="btn btn-primary w-100 mt-3 rounded-pill"
                onClick={isEditing ? handleUpdateItem : handleAddItem}
              >
                {isEditing ? "Update Item" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-body">
              <h4 className="text-muted">Your Inventory Items</h4>
              <ul className="list-group">
                {inventoryItems.map((item) => (
                  <li
                    key={item._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{item.name}</strong> - {item.quantity} -{" "}
                      {item.description} - Due:{" "}
                      {new Date(item.dueDate).toLocaleDateString()}
                    </div>
                    <div>
                      <button
                        className="btn btn-sm me-2"
                        style={{ backgroundColor: "#17a2b8", color: "#fff" }}
                        onClick={() => handleEditItem(item)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteItem(item._id)}
                      >
                       <FaTrash/> Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;
