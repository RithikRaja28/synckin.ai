import React from "react";
import CreateFamily from "./utils/CreateFamily";
import AddFamilyMember from "./utils/AddMember";
import FamilyDetails from "./utils/FamilyDetails"; // Import FamilyDetails component

const FamilyPage = () => {
  return (
    <div className="container mt-4">
      <h2>Family Management</h2>
      <CreateFamily />
      <hr />
      <AddFamilyMember />
      <hr />
      <FamilyDetails /> {/* Add FamilyDetails component */}
    </div>
  );
};

export default FamilyPage;
