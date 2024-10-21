import React, { useContext } from "react";
import { Navbar, Nav, Form, FormControl, Dropdown } from "react-bootstrap";
import { FaBell, FaUserCircle, FaCrown } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom"; // Import Link for routing
import { styled } from "@mui/material/styles";

const ShiningText = styled("span")({
  position: "relative",
  display: "inline-block",
  overflow: "hidden",
  borderRadius: "10px",
  padding: "0 10px",
  "&:before": {
    content: "''",
    position: "absolute",
    top: 0,
    left: "-100%",
    height: "100%",
    width: "100%",
    background:
      "linear-gradient(120deg, transparent, rgba(255,255,255,0.7), transparent)",
    animation: "shimmer 2s infinite",
  },
  "@keyframes shimmer": {
    "0%": { left: "-100%" },
    "50%": { left: "100%" },
    "100%": { left: "100%" },
  },
});

const Header = ({ onProfileClick }) => {
  const { auth, logout } = useContext(AuthContext);
  const isSubscribed = auth.user?.subscription?.status;

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      className="px-3"
      style={{
        backgroundColor: "#1a1a1a",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
      }}
    >
      <Navbar.Brand as={Link} to="/" className="text-info">
        <img
          src=".\favicon-synckin.png"
          alt="Synckin.ai Logo"
          style={{ width: "40px" }}
        />{" "}
        Synckin.ai
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        {/* Centered Search Bar */}
        <Form className="mx-auto" style={{ width: "40%" }}>
          <FormControl
            type="search"
            placeholder="Search"
            className="mr-2 bg-dark text-light"
            style={{ borderRadius: "20px", border: "none" }}
          />
        </Form>

        {/* Right-hand Side Icons */}
        <Nav className="ml-auto d-flex align-items-center">
          {/* Subscription Status: If not subscribed, show "Subscribe" with crown icon */}
          {!isSubscribed ? (
            <Nav.Link
              as={Link}
              to="/subscribe"
              className="d-flex align-items-center text-warning"
            >
              <FaCrown className="mr-2" />
              <ShiningText className="ms-2">Subscribe</ShiningText>
            </Nav.Link>
          ) : (
            <Nav.Link as={Link} to="/dashboard" className="text-warning">
              <ShiningText>
                <FaCrown />
              </ShiningText>
            </Nav.Link>
          )}

          <Nav.Link as={Link} to="/dashboard/notifications">
            <FaBell className="text-light" />
          </Nav.Link>

          {/* Profile Dropdown */}

          {/* Profile Dropdown */}
          <Dropdown align="end" className="ms-3">
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              <FaUserCircle className="text-light" />
            </Dropdown.Toggle>

            <Dropdown.Menu align="end" className="bg-dark text-light">
              <Dropdown.Item
                as={Link}
                to="/dashboard/profile"
                className="text-light"
                onClick={onProfileClick} // Profile Click Handler
              >
                Profile
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/settings" className="text-light">
                Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                href="#logout"
                className="text-light"
                onClick={logout}
              >
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
