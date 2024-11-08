import React from "react";
import CreateFamily from "./utils/CreateFamily";
import AddFamilyMember from "./utils/AddMember";
import FamilyDetails from "./utils/FamilyDetails";
import {
  Fab,
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/system";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

// Custom styles for a more modern, consistent look
const PageContainer = styled(Container)({
  marginTop: "2rem",
  width: "100%",
  padding: "1rem",
  borderRadius: "12px",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
});

const HeaderBox = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "2rem",
});

const StyledFab = styled(Fab)({
  backgroundColor: "#1976d2",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#115293",
  },
});

const CustomCard = styled(Card)({
  borderRadius: "12px",
  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.12)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
  },
});

const SectionTitle = styled(Typography)({
  color: "#333",
  fontWeight: 500,
  textAlign: "center",
  paddingBottom: "1rem",
  borderBottom: "1px solid #ddd",
  marginBottom: "1.5rem",
});

const PrimaryButton = styled(Button)({
  marginTop: "1rem",
  backgroundColor: "#1976d2",
  color: "#fff",
  borderRadius: "20px",
  padding: "0.5rem 1.5rem",
  fontWeight: 600,
  textTransform: "none",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#115293",
  },
});

const FamilyPage = () => {
  return (
    <PageContainer maxWidth="lg">
      <HeaderBox>
        <Typography variant="h5">
          Family Management
        </Typography>
        <StyledFab color="primary" aria-label="add">
          <AddIcon />
        </StyledFab>
      </HeaderBox>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <CustomCard>
            <CardContent>
              <SectionTitle variant="h5">Create a Family</SectionTitle>
              <CreateFamily />
              
            </CardContent>
          </CustomCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomCard>
            <CardContent>
              <SectionTitle variant="h5">Add Family Member</SectionTitle>
              <AddFamilyMember />
              
            </CardContent>
          </CustomCard>
        </Grid>

        <Grid item xs={12}>
          <CustomCard>
            <CardContent>
              <SectionTitle variant="h5">Family Details</SectionTitle>
              <FamilyDetails />
            </CardContent>
          </CustomCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default FamilyPage;
