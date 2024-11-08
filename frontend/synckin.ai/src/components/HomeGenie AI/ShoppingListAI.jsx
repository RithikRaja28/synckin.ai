import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { TextField, Typography, Box } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactMarkdown from "react-markdown";

const ShoppingList = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shoppingList, setShoppingList] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShoppingList("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/homegenie/generate-shopping-list",
        { input }
      );
      setShoppingList(response.data.shoppingList);
    } catch (err) {
      setError("Failed to generate shopping list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{
        padding: "2rem",
      }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Box
            sx={{
              width: "100%",
              padding: "2rem",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
              
              }}
            >
              AI Shopping List Generator
            </Typography>

            {/* Form Input */}
            <Form onSubmit={handleSubmit} className="mt-4 mb-4">
              <Form.Group controlId="formInput" className="mb-4">
                <TextField
                  label="Enter Recipe, Meal Plan, or Items"
                  variant="outlined"
                  fullWidth
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  required
                  InputProps={{
                    style: {
                      padding: "12px",
                      backgroundColor: "#f9f9f9",
                      borderRadius: "8px",
                    },
                  }}
                />
              </Form.Group>
              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-100"
                style={{
                  padding: "0.75rem",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  borderRadius: "8px",
                  backgroundColor: "#007bff",
                  borderColor: "#007bff",
                  transition: "background-color 0.3s ease",
                }}
              >
                {loading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                  />
                ) : (
                  "Generate Shopping List"
                )}
              </Button>
            </Form>

            {/* Error Message */}
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}

            {/* Generated Shopping List */}
            {shoppingList && (
              <Alert
                variant="success"
                className="mt-4"
                style={{
                  padding: "1.5rem",
                  borderRadius: "12px",
                  textAlign: "left",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Generated Shopping List
                </Typography>
                <div
                  style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    padding: "0.5rem",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <ReactMarkdown>{shoppingList}</ReactMarkdown>
                </div>
              </Alert>
            )}
          </Box>
        </Col>
      </Row>
    </Container>
  );
};

export default ShoppingList;
