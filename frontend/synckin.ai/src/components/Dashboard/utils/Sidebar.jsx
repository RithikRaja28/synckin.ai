import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import {
  FaHome,
  FaDollarSign,
  FaBox,
  FaTasks,
  FaUser,
  FaCog,
  FaBell,
  FaBars,
  FaCalendar,
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle button for small screens */}
      <div className="d-lg-none">
        <button
          onClick={toggleSidebar}
          className="btn btn-dark"
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1100,
            backgroundColor: "#1a1a1a",
          }}
        >
          <FaBars />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`d-flex flex-column vh-100 p-3 text-light ${
          isOpen ? "d-block" : "d-none d-lg-block"
        }`}
        style={{
          transition: "all 0.3s ease-in-out",
          width: "250px",
          marginTop: isOpen ? "50px" : "0px",
          backgroundColor: "#1a1a1a",
          boxShadow: "2px 0 6px rgba(0, 0, 0, 0.5)",
          position: "fixed",
          top: "0",
          left: "0",
          zIndex: 1000,
          overflowY: "auto", // This prevents overflow on smaller screens
        }}
      >
        <Nav defaultActiveKey="/dashboard" className="flex-column">
          <NavLink
            to="/dashboard"
            className={`nav-link ${
              location.pathname === "/dashboard"
                ? "text-info active"
                : "text-light"
            }`}
          >
            <FaHome className="me-2" /> Dashboard
          </NavLink>
          <NavLink
            to="/dashboard/incometracker"
            className={`nav-link ${
              location.pathname === "/dashboard/incometracker"
                ? "text-info active"
                : "text-light"
            }`}
          >
            <FaDollarSign className="me-2" /> Expense Tracker
          </NavLink>
          <NavLink
            to="/dashboard/inventorytracker"
            className={`nav-link ${
              location.pathname === "/dashboard/inventorytracker"
                ? "text-info active"
                : "text-light"
            }`}
          >
            <FaBox className="me-2" /> Inventory
          </NavLink>
          <NavLink
            to="/dashboard/taskmanager"
            className={`nav-link ${
              location.pathname === "/dashboard/taskmanager"
                ? "text-info active"
                : "text-light"
            }`}
          >
            <FaTasks className="me-2" /> Tasks
          </NavLink>
          <NavLink
            to="/dashboard/budget-planning"
            className={`nav-link ${
              location.pathname === "/dashboard/budget-planning"
                ? "text-info active"
                : "text-light"
            }`}
          >
            <FaCalendar className="me-2" /> Budget Planning
          </NavLink>
          <NavLink
            to="/dashboard/family"
            className={`nav-link ${
              location.pathname === "/dashboard/family"
                ? "text-info active"
                : "text-light"
            }`}
          >
            <FaUser className="me-2" /> Family Members
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            className={`nav-link ${
              location.pathname === "/dashboard/settings"
                ? "text-info active"
                : "text-light"
            }`}
          >
            <FaCog className="me-2" /> Settings
          </NavLink>
          <NavLink
            to="/dashboard/notifications"
            className={`nav-link ${
              location.pathname === "/dashboard/notifications"
                ? "text-info active"
                : "text-light"
            }`}
          >
            <FaBell className="me-2" /> Notifications
          </NavLink>
        </Nav>
      </div>

      {/* Overlay for smaller screens when sidebar is open */}
      {isOpen && (
        <div
          className="d-lg-none"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
