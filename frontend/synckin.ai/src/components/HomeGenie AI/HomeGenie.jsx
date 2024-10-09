import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import SuggestionComponent from "./SuggestionComponent";
import HomeDecorComponent from "./HomeDecorComponent";
import ShoppingList from "./ShoppingListAI";
import RecipeGeneratorAI from "./RecipeGeneratorAI";

// Custom Styled Tabs with light theme enhancements
const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    display: "none", // Hide default underline indicator
  },
  backgroundColor: "#fff", // White background for light theme
  borderRadius: "8px",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.05)", // Subtle shadow for depth
  [theme.breakpoints.down("sm")]: {
    "& .MuiTabs-flexContainer": {
      justifyContent: "center", // Center tabs on smaller screens
    },
  },
}));

const StyledTab = styled((props) => <Tab {...props} />)(({ theme }) => ({
  textTransform: "none",
  fontWeight: "bold",
  fontSize: "1rem",
  marginRight: theme.spacing(2),
  color: "#999", // Light gray for inactive tab color
  "&.Mui-selected": {
    color: "#333", // Darker gray for active tab text color
    backgroundColor: "#f0f4ff", // Soft blue background for active tab
    borderRadius: "20px", // Rounded corners for a modern look
  },
  "&:hover": {
    backgroundColor: "#e0e8ff", // Light background on hover
    color: "#000",
    transition: "0.3s",
    borderRadius: "20px", // Smooth hover effect
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.85rem", // Reduce font size for small screens
    marginRight: theme.spacing(1), // Reduce margin for smaller screens
  },
}));

const HomeGenie = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div
      style={{
        padding: "20px",
        minHeight: "100vh",
        backgroundColor: "#f8f9fc", // Light background for the entire page
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          marginTop: "20px",
          textAlign: "center",
          color: "#444",
          fontSize: "2rem",
          fontWeight: "bold",
        }}
        className="mb-4"
      >
        HomeGenie AI
      </h2>

      {/* Custom Styled Tabs for switching between components */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          marginBottom: "20px",
          padding: "10px",
          borderRadius: "12px",
          boxShadow: "0px 2px 15px rgba(0, 0, 0, 0.05)", // Soft shadow for tab container
          backgroundColor: "#fff", // White background for the tab container
        }}
      >
        <StyledTabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="home-genie-tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <StyledTab label="Suggestions" />
          <StyledTab label="Home Decor" />
          <StyledTab label="Shopping List" />
          <StyledTab label ="Recipe Generator" />
        </StyledTabs>
      </Box>

      {/* Render components based on active tab */}
      <div
        style={{
          maxWidth: "100%",
          overflowX: "auto",
          padding: "20px",
          backgroundColor: "#fff", // White background for the content area
          borderRadius: "12px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)", // Soft shadow for content area
          transition: "all 0.3s ease-in-out",
        }}
      >
        {activeTab === 0 && <SuggestionComponent />}
        {activeTab === 1 && <HomeDecorComponent />}
        {activeTab === 2 && <ShoppingList />}
        {activeTab === 3 && <RecipeGeneratorAI />}
      </div>
    </div>
  );
};

export default HomeGenie;
