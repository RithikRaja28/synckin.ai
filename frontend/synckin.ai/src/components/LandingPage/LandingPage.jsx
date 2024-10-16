import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, Typography, Grid, Container, Box } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

// Styled components
const Navbar = styled(AppBar)`
  background-color: ${(props) => (props.scroll ? "#111" : "transparent")};
  box-shadow: ${(props) => (props.scroll ? "0px 4px 12px rgba(0, 0, 0, 0.2)" : "none")};
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const NavbarButton = styled(Button)`
  color: white;
  font-weight: bold;
  &:hover {
    background-color: #9c27b0;
    color: white;
  }
`;

const HeroSection = styled(motion.section)`
  background-color: #1a1a1a;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 50px;
`;

const HeroText = styled.div`
  h1 {
    font-size: 4rem;
    color: #9c27b0;
    margin-bottom: 1.5rem;
  }
  p {
    color: #ccc;
    font-size: 1.3rem;
    margin-bottom: 2rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const FeaturesSection = styled.section`
  background-color: #181818;
  padding: 80px 0;
`;

const FeatureCard = styled(motion.div)`
  background-color: #242424;
  padding: 30px;
  border-radius: 10px;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #9c27b0;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
`;

const Footer = styled.footer`
  background-color: #121212;
  padding: 20px 0;
  color: #777;
  text-align: center;
`;

const LandingPage = () => {
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      {/* Navbar */}
      <Navbar scroll={scroll}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, fontWeight: "bold", color: "#fff" }}>
            Synckin.ai
          </Typography>
          <NavbarButton component={Link} to="/login">
            Login
          </NavbarButton>
          <NavbarButton component={Link} to="/signup">
            Sign Up
          </NavbarButton>
        </Toolbar>
      </Navbar>

      {/* Hero Section */}
      <HeroSection initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <HeroText>
                <h1>Empower Your Household with AI-Driven Management</h1>
                <p>Manage, track, and enhance your home with personalized AI solutions.</p>
                <HeroButtons>
                  <Button variant="contained" color="primary" component={Link} to="/signup">
                    Get Started
                  </Button>
                  <Button variant="outlined" color="secondary" component={Link} to="/features">
                    Explore Features
                  </Button>
                </HeroButtons>
              </HeroText>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component={motion.div}
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <img
                  src="/path/to/3d-image.png"
                  alt="3D AI Illustration"
                  style={{ width: "100%", borderRadius: "10px" }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <Container>
          <SectionTitle>Features</SectionTitle>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <FeatureCard whileHover={{ scale: 1.05 }}>
                <Typography variant="h5">Finance Tracker</Typography>
                <p>Track income, savings, debt, and expenses with AI-powered insights.</p>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard whileHover={{ scale: 1.05 }}>
                <Typography variant="h5">Task Management</Typography>
                <p>Assign tasks to family members and manage household efficiently.</p>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard whileHover={{ scale: 1.05 }}>
                <Typography variant="h5">Personalized AI</Typography>
                <p>Get personalized AI services like home decor, shopping lists, and recipes.</p>
              </FeatureCard>
            </Grid>
          </Grid>
        </Container>
      </FeaturesSection>

      {/* Footer */}
      <Footer>
        <Typography variant="body2" color="textSecondary">
          © 2024 Synckin.ai | All Rights Reserved
        </Typography>
      </Footer>
    </div>
  );
};

export default LandingPage;
