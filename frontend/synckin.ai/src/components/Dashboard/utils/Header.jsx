import React, { useContext } from "react";
import { Navbar, Nav, Form, FormControl, Dropdown } from "react-bootstrap";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom"; // Import Link for routing

const Header = ({ onProfileClick }) => {
  const { logout } = useContext(AuthContext); // Context for handling logout

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
          <Nav.Link as={Link} to="/dashboard/notifications">
            <FaBell className="text-light" />
          </Nav.Link>

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
