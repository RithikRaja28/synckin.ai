import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  Avatar,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Grid,
} from "@mui/material";
import "./ProfileDashboard.css";

const ProfileDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        if (!token) {
          throw new Error("No token found");
        }

        const config = {
          headers: {
            "x-auth-token": token,
          },
        };

        const response = await axios.get(
          "http://localhost:5000/auth/user",
          config
        );
        setUserData(response.data);
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        setError("Failed to fetch user data");
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Container className="mt-5">
      <Paper elevation={3} style={{ padding: "25px", marginBottom: "15px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} className="text-center">
            {/* User Avatar */}
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: "0 auto",
                fontSize: "3rem",
              }}
            >
              {userData.username?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="h4" gutterBottom mt={2}>
              {userData.username}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {userData.email}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Role: {userData.role}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={8}>
            {/* User Details Card */}
            <Card>
              <Card.Header as="h5">Profile Details</Card.Header>
              <Card.Body>
                <Card.Title>{userData.username}'s Profile</Card.Title>
                <Card.Text>
                  <strong>Email:</strong> {userData.email} <br />
                  <strong>Role:</strong> {userData.role} <br />
                  <strong>Family ID:</strong> {userData.familyId || "No Family"}{" "}
                  <br />
                  <strong>Date Joined:</strong>{" "}
                  {new Date(userData.date).toLocaleDateString()}
                </Card.Text>
                
              </Card.Body>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfileDashboard;
