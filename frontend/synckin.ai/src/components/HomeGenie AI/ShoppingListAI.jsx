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
    <Container fluid className="p-4">
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <Typography variant="h4" gutterBottom>
            AI Shopping List Generator
          </Typography>
          <Form
            onSubmit={handleSubmit}
            className="p-3"
            style={{ border: "1px solid #ccc", borderRadius: "8px" }}
          >
            <Form.Group controlId="formInput" className="mb-3">
              <TextField
                label="Enter Recipe, Meal Plan or Low Items"
                variant="outlined"
                fullWidth
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="mb-3"
              fullWidth
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Generate Shopping List"
              )}
            </Button>
          </Form>
          {error && <Alert variant="danger">{error}</Alert>}
          {shoppingList && (
            <Alert variant="success" className="mt-3">
              <Typography variant="h6">Generated Shopping List</Typography>
              <pre>{shoppingList}</pre>
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ShoppingList;
