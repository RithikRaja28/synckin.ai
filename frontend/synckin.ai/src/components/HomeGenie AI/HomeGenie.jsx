import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import SuggestionComponent from "./SuggestionComponent";
import HomeDecorComponent from "./HomeDecorComponent";

import ShoppingList from "./ShoppingListAI";

// Custom Styled Tabs
const StyledTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    display: "none", // Hide the default underline indicator
  },
});

const StyledTab = styled((props) => <Tab {...props} />)(({ theme }) => ({
  textTransform: "none",
  fontWeight: "bold",
  fontSize: "1rem",
  marginRight: theme.spacing(2),
  color: "#555", // Inactive tab color
  "&.Mui-selected": {
    color: "#000", // Active tab text color
    backgroundColor: "#CDC1FF", // Active tab background color (customize this)
    borderRadius: "20px", // Rounded corners for modern look
  },
  "&:hover": {
    backgroundColor: "#F5EFFF", // Change background color on hover
    color: "#000",
    transition: "0.3s",
    borderRadius: "20px", // Smooth hover effect
  },
}));

const HomeGenie = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }} className="mb-4">
        HomeGenie AI
      </h2>

      {/* Custom Styled Tabs for switching between components */}
      <Box
        sx={{ borderBottom: 1, borderColor: "divider", marginBottom: "20px" }}
      >
        <StyledTabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="home-genie-tabs"
        >
          <StyledTab label="Suggestions" />
          <StyledTab label="Home Decor" />
          <StyledTab label="Shopping List" /> {/* New Shopping List tab */}
        </StyledTabs>
      </Box>

      {/* Render components based on active tab */}
      <div>
        {activeTab === 0 && <SuggestionComponent />}
        {activeTab === 1 && <HomeDecorComponent />}
        {activeTab === 2 && <ShoppingList />}{" "}
        {/* Render Shopping List component */}
      </div>
    </div>
  );
};

export default HomeGenie;
