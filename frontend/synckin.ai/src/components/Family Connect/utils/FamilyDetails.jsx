import React, { useEffect, useState } from "react";
import axios from "axios";

const FamilyDetails = () => {
  const [family, setFamily] = useState(null);
  const [error, setError] = useState("");

  const fetchFamily = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:5000/api/family/show", {
        headers: { "x-auth-token": token },
      });
      setFamily(response.data);
      setError("");
    } catch (err) {
      setError("Error fetching family details.");
      console.error("Error fetching family:", err.response.data);
    }
  };

  useEffect(() => {
    fetchFamily();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!family) {
    return <div>Loading family details...</div>;
  }

  return (
    <div>
      <h3>Family: {family.familyName}</h3>
      <h4>Members:</h4>
      <ul>
        {family.members.map((member) => (
          <li key={member.userId._id}>
            {member.userId.username} - {member.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FamilyDetails;
