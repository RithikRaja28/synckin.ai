import React from "react";
import CreateFamily from "./utils/CreateFamily";
import AddFamilyMember from "./utils/AddMember";
import FamilyDetails from "./utils/FamilyDetails";
import { Fab, Container, Grid, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

const FamilyPage = () => {
  return (
    <Container className="mt-4" maxWidth="lg">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className="mb-3"
      >
        <Typography variant="h4" gutterBottom>
          Family Management
        </Typography>
        <Fab color="primary" aria-label="add" className="ms-3">
          <AddIcon />
        </Fab>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} className="mb-4">
          <CreateFamily />
        </Grid>
        <Grid item xs={12} md={6} className="mb-4">
          <AddFamilyMember />
        </Grid>
        <Grid item xs={12}>
          <FamilyDetails />
        </Grid>
      </Grid>
    </Container>
  );
};

export default FamilyPage;
