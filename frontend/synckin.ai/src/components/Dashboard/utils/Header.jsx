import React, { useContext } from "react";
import { Navbar, Nav, Form, FormControl, Dropdown } from "react-bootstrap";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";
const Header = () => {
  const { logout } = useContext(AuthContext);
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
      <Navbar.Brand href="/" className="text-info">
        🤖 Synckin.ai
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Form className="mx-auto" style={{ width: "40%" }}>
          <FormControl
            type="search"
            placeholder="Search"
            className="mr-2 bg-dark text-light "
            style={{ borderRadius: "20px", border: "none" }}
          />
        </Form>
        <Nav className="ml-auto">
          <Nav.Link href="#notifications">
            <FaBell className="text-light" />
          </Nav.Link>
          <Dropdown alignLeft className="text-light me-2 ms-2">
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              <FaUserCircle className="text-light" />
            </Dropdown.Toggle>

            <Dropdown.Menu align="right" className="bg-dark text-light">
              <Dropdown.Item href="#profile" className="text-light">
                Profile
              </Dropdown.Item>
              <Dropdown.Item href="#settings" className="text-light">
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
