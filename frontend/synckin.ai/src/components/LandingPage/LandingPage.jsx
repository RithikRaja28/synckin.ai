import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Navbar from "./Navbar";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <div
        style={{
          backgroundColor: "#121212", // Dark background
          color: "white",
          minHeight: "100vh",
          padding: "50px 0",
        }}
      >
        <Container>
          {/* Hero Section */}
          <Row className="align-items-center">
            <Col md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#2196f3" }} // Blue primary color
              >
                Welcome to Synckin.ai
              </Typography>
              <Typography
                variant="h6"
                component="p"
                gutterBottom
                sx={{ color: "#b0bec5", fontSize: "18px" }}
              >
                Manage your household effortlessly with personalized AI
                services.
              </Typography>
              <Button
                variant="contained"
                size="large"
                href="#features"
                sx={{
                  backgroundColor: "#2196f3", // Blue button
                  color: "white",
                  marginTop: "20px",
                  "&:hover": { backgroundColor: "#1976d2" }, // Darker blue on hover
                }}
              >
                Get Started
              </Button>
            </Col>
            <Col md={6}>
              {/* Embed Spline 3D Model */}
              <Box
                sx={{
                  width: "100%",
                  height: "500px",
                  borderRadius: "15px",
                  overflow: "hidden",
                  border: "2px solid #2196f3", // Blue border for the model
                  position: "relative",
                }}
              >
                <iframe
                  src="https://my.spline.design/minihomeconditionallogiccopy-bd806f165d161ec4198ca759fde3801a/"
                  frameBorder="0"
                  width="100%"
                  height="100%"
                  title="Spline 3D Model"
                  style={{
                    border: "none",
                    borderRadius: "15px",
                    overflow: "hidden",
                  }}
                ></iframe>
                {/* Note about using WASD keys */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                >
                  Use WASD keys to navigate in the 3D scene
                </Box>
              </Box>
            </Col>
          </Row>
          {/* Divider between sections */}
          <Divider sx={{ backgroundColor: "#2196f3", margin: "50px 0" }} />{" "}
          {/* Blue divider */}
          {/* Features Section */}
          <section id="features">
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: "bold", textAlign: "center", color: "#2196f3" }} // Blue primary color
            >
              Features
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    backgroundColor: "#1f1f1f",
                    color: "white",
                    border: "1px solid #2196f3",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <CardContent>
                    <HomeIcon fontSize="large" sx={{ color: "#2196f3" }} />{" "}
                    {/* Blue icon */}
                    <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                      Home Decor AI
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#b0bec5" }}>
                      Upload a photo of your room, and our AI will suggest
                      personalized decor options to elevate your space.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    backgroundColor: "#1f1f1f",
                    color: "white",
                    border: "1px solid #2196f3",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <CardContent>
                    <CheckCircleOutlineIcon
                      fontSize="large"
                      sx={{ color: "#2196f3" }} // Blue icon
                    />
                    <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                      Task Management
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#b0bec5" }}>
                      Assign tasks to family members and track progress with our
                      seamless task management feature.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    backgroundColor: "#1f1f1f",
                    color: "white",
                    border: "1px solid #2196f3",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <CardContent>
                    <MonetizationOnIcon
                      fontSize="large"
                      sx={{ color: "#2196f3" }} // Blue icon
                    />
                    <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                      Finance Tracker
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#b0bec5" }}>
                      Keep track of your expenses, savings, and budget planning
                      all in one place with AI assistance.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </section>
          {/* Divider between sections */}
          <Divider sx={{ backgroundColor: "#2196f3", margin: "50px 0" }} />{" "}
          {/* Blue divider */}
          {/* Pricing Section */}
          <section id="pricing">
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: "bold", textAlign: "center", color: "#2196f3" }} // Blue primary color
            >
              Pricing
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              style={{ textAlign: "center", color: "#b0bec5" }}
            >
              Choose the plan that fits your needs.
            </Typography>
            {/* Add pricing cards here */}
          </section>
          {/* Divider between sections */}
          <Divider sx={{ backgroundColor: "#2196f3", margin: "50px 0" }} />{" "}
          {/* Blue divider */}
          {/* Contact Section */}
          <section id="contact">
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: "bold", textAlign: "center", color: "#2196f3" }} // Blue primary color
            >
              Contact Us
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              style={{ textAlign: "center", color: "#b0bec5" }}
            >
              Have any questions? Reach out to us.
            </Typography>
            {/* Add contact form or details */}
          </section>
        </Container>
      </div>
    </>
  );
};

export default LandingPage;
