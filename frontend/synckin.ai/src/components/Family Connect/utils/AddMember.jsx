import React, { useState } from "react";
import axios from "axios";

const AddFamilyMember = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("Child");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addFamilyMember = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/family/add-member",
        { username, role }, // Send the role and username
        {
          headers: { "x-auth-token": token },
        }
      );
      setSuccess("Member added successfully");
      setError("");
      console.log("Member added:", response.data);
    } catch (error) {
      setError("Error adding member");
      setSuccess("");
      console.error("Error adding member:", error.response.data);
    }
  };

  return (
    <div>
      <h3>Add Family Member</h3>
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Role</label>
        <select
          className="form-control"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="Parent">Parent</option>
          <option value="Children">Children</option>
        </select>
      </div>
      <button className="btn btn-primary" onClick={addFamilyMember}>
        Add Member
      </button>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
      {success && <div className="alert alert-success mt-2">{success}</div>}
    </div>
  );
};

export default AddFamilyMember;
