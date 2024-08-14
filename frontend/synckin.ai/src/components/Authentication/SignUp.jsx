import React, { useState, useContext } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      console.log("Registration successful");
      navigate("/dashboard");
      // Redirect to dashboard or another page after successful signup
    } catch (err) {
      console.error(
        "Registration failed",
        err.response ? err.response.data : err.message
      );
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{
        minWidth: "100%",
        minHeight: "100vh",
        backgroundColor: "#121212",
        backgroundImage: "linear-gradient(135deg, #1a1a1a, #121212)",
      }}
    >
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <Card
            className="p-4 shadow-lg"
            style={{
              backgroundColor: "#1f1f1f",
              borderRadius: "15px",
              border: "none",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
            }}
          >
            <Card.Body>
              <h2
                className="text-center mb-4 text-info"
                style={{ fontWeight: "600", letterSpacing: "1px" }}
              >
                <FaUserPlus /> <span className="ms-2">Sign Up</span>
              </h2>
              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label className="text-light">Username</Form.Label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-secondary text-light">
                        <FaUser />
                      </span>
                    </div>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      className="bg-dark text-light border-0 ms-2"
                      style={{ borderRadius: "5px", boxShadow: "none" }}
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="text-light">Email</Form.Label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-secondary text-light">
                        <FaEnvelope />
                      </span>
                    </div>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email"
                      className="bg-dark text-light border-0 ms-2"
                      style={{ borderRadius: "5px", boxShadow: "none" }}
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className="text-light">Password</Form.Label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-secondary text-light">
                        <FaLock />
                      </span>
                    </div>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="bg-dark text-light border-0 ms-2"
                      style={{ borderRadius: "5px", boxShadow: "none" }}
                      required
                    />
                  </div>
                </Form.Group>

                <Button
                  variant="info"
                  type="submit"
                  className="w-100 mt-3"
                  style={{
                    backgroundColor: "#17a2b8",
                    border: "none",
                    borderRadius: "50px",
                    fontWeight: "bold",
                    color: "#ffffff",
                    transition: "background-color 0.3s ease, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#138496";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#17a2b8";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
            <p className="text-center text-light mt-4">
              Already have an account?{" "}
              <span className="text-info">
                <a
                  href="/login"
                  className="text-info"
                  style={{ textDecoration: "none" }}
                >
                  Login
                </a>
              </span>
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
