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
import { TextField, Typography } from "@mui/material";
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
    <Container fluid className="p-4" style={{ minHeight: "100vh" }}>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} className="text-center">
          <div
            style={{
              padding: "20px",
              backgroundColor: "#f8f9fa",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              maxWidth: "100%",
            }}
          >
            <Typography variant="h5" className="mb-4" gutterBottom>
              AI Shopping List Generator
            </Typography>

            {/* Form Input */}
            <Form
              onSubmit={handleSubmit}
              className="p-3"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <Form.Group controlId="formInput" className="mb-3">
                <TextField
                  label="Enter Recipe, Meal Plan or Low Items"
                  variant="outlined"
                  fullWidth
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  required
                  InputProps={{
                    style: { padding: "12px" },
                  }}
                />
              </Form.Group>
              <Button
                type="submit"
                disabled={loading}
                className="mb-3 mt-3 btn btn-primary btn-block"
                fullWidth
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Generate Shopping List"
                )}
              </Button>
            </Form>

            {/* Error Message */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Generated Shopping List */}
            {shoppingList && (
              <Alert variant="success" className="mt-3">
                <Typography variant="h6">Generated Shopping List</Typography>
                <div
                  style={{
                    maxHeight: "450px", // Set a max height to prevent overflow
                    overflowY: "auto", // Add vertical scroll if the content is long
                    textAlign: "left", // Align the text to the left for better readability
                    whiteSpace: "pre-wrap", // Preserve whitespace formatting
                  }}
                >
                  <ReactMarkdown>{shoppingList}</ReactMarkdown>
                </div>
              </Alert>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ShoppingList;
