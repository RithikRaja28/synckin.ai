import React, { useState } from "react";
import axios from "axios";

const CreateFamily = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

 const createFamily = async () => {
   const token = localStorage.getItem("token");
   const familyName = "My Family Name"; // Get this value from a form input

   try {
     const response = await axios.post(
       "http://localhost:5000/api/family/create",
       { familyName }, // Include familyName in the request body
       {
         headers: { "x-auth-token": token },
       }
     );
     console.log("Family created:", response.data);
   } catch (error) {
     console.error("Error creating family:", error.response.data);
   }
 };
  return (
    <div>
      <h3>Create Family</h3>
      <button className="btn btn-primary" onClick={createFamily}>
        Create Family
      </button>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
      {success && <div className="alert alert-success mt-2">{success}</div>}
    </div>
  );
};

export default CreateFamily;
