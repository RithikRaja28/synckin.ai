import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CheckCircle, CreditCard } from "@mui/icons-material";
import { loadStripe } from "@stripe/stripe-js"; // Load Stripe
import { Elements } from "@stripe/react-stripe-js"; // Stripe Elements wrapper
import axios from "axios"; // Axios for making API requests
import "bootstrap/dist/css/bootstrap.min.css";

const stripePromise = loadStripe(
  "pk_test_51QCkgUAuedRxnYBSyxg6dxRGyljpb4pa90OEGVticPnyMDYc3YJBt8hbcWABvyituvVpgda8ZbdVIdz9o9LEVwjN00UBLUjhl5"
);

// Styled components for the buttons to make them more visually appealing
const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#1976d2", // MUI Primary color
  color: "#fff",
  fontWeight: "bold",
  padding: "12px 24px",
  fontSize: "1.2rem",
  borderRadius: "25px",
  "&:hover": {
    backgroundColor: "#125e9c",
    boxShadow: "0px 6px 25px rgba(25, 118, 210, 0.4)", // Hover effect
    transform: "translateY(-3px)", // Lift effect
    transition: "all 0.3s ease",
  },
}));

// Add some animations for smooth scrolling
const AnimatedCard = styled(Card)(({ theme }) => ({
  borderRadius: "15px",
  boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  padding: "30px",
  backgroundImage: "linear-gradient(135deg, #f0f4ff 30%, #ffffff 90%)", // Subtle gradient
  "&:hover": {
    transform: "translateY(-10px)", // Lift effect on hover
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
  },
}));

const SubscriptionPage = () => {
  const handleCheckout = async (price) => {
    try {
      const token = localStorage.getItem("token"); // Get user's auth token
      const response = await axios.post(
        "http://localhost:5000/api/stripe/create-checkout-session",
        { price },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      const { id } = response.data;
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: id });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };
  return (
    <Elements stripe={stripePromise}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          paddingTop: "40px",
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            padding: "40px 20px",
            background: "linear-gradient(135deg, #e0ecff 20%, #ffffff 100%)",
            textAlign: "center",
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: "bold", color: "#333" }}>
            Unlock Premium AI Features
          </Typography>
          <Typography
            variant="h6"
            sx={{ marginTop: "15px", fontWeight: "400", color: "#555" }}
          >
            Get exclusive access to AI-generated suggestions, home decor ideas,
            personalized shopping lists, and more!
          </Typography>
          <StyledButton
            variant="contained"
            color="primary"
            size="large"
            sx={{ marginTop: "30px", padding: "10px 40px", fontSize: "1.3rem" }}
            startIcon={<CreditCard />}
            onClick={() => handleCheckout(69)}
          >
            Subscribe Now
          </StyledButton>
        </Box>

        {/* Subscription Plan Section */}
        <Container className="mt-5" style={{ flex: "1 0 auto" }}>
          <Grid container spacing={4} justifyContent="center">
            {/* Basic Plan */}
            <Grid item xs={12} md={6}>
              <AnimatedCard>
                {/* Badge for extra visibility */}
                <Chip
                  label="Most Popular"
                  color="primary"
                  sx={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                  }}
                />
                <CardContent>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "#1976d2",
                      marginBottom: "20px",
                    }}
                  >
                    Basic Plan
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#333",
                      marginBottom: "10px",
                    }}
                  >
                    ₹69
                  </Typography>
                  <Typography
                    variant="h6"
                    color="textSecondary"
                    sx={{ textAlign: "center", color: "#777" }}
                  >
                    per month
                  </Typography>
                  <ul
                    className="list-unstyled"
                    style={{
                      textAlign: "center",
                      fontSize: "1.1rem",
                      lineHeight: "2.2",
                      marginTop: "20px",
                    }}
                  >
                    <li>
                      <CheckCircle color="primary" /> Access AI Suggestions
                    </li>
                    <li>
                      <CheckCircle color="primary" /> Recipe Generator
                    </li>
                    <li>
                      <CheckCircle color="primary" /> Home Decor Ideas
                    </li>
                    <li>
                      <CheckCircle color="primary" /> Personalized Shopping
                      Lists
                    </li>
                  </ul>
                  <Box textAlign="center" sx={{ marginTop: "30px" }}>
                    <StyledButton
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<CreditCard />}
                      onClick={() => handleCheckout(69)}
                    >
                      Subscribe for ₹69/month
                    </StyledButton>
                  </Box>
                </CardContent>
              </AnimatedCard>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Elements>
  );
};

export default SubscriptionPage;
