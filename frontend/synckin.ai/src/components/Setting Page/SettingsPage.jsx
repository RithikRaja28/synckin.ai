import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import { Container, Row, Col } from "react-bootstrap";
import PersonIcon from "@mui/icons-material/Person";
import PaletteIcon from "@mui/icons-material/Palette";
import SecurityIcon from "@mui/icons-material/Security";

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    role: "",
  });
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("profile"); // Default to profile tab

  useEffect(() => {
    // Fetch current profile
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const config = {
          headers: {
            "x-auth-token": token,
          },
        };

        setLoading(true);
        const res = await axios.get("http://localhost:5000/auth/user", config);
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab); // Set the active tab when clicked
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.checked ? "dark" : "light");
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const config = {
        headers: {
          "x-auth-token": token,
        },
      };
      setLoading(true);
      setError("");
      setSuccess("");
      await axios.put("http://localhost:5000/auth/profile", profile, config);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="mt-5">
      <Row>
        {/* Left-side Navigation */}
        <Col md={3} className="border-end">
          <List component="nav">
            <ListItem
              button
              selected={activeTab === "profile"}
              onClick={() => handleTabClick("profile")}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem
              button
              selected={activeTab === "theme"}
              onClick={() => handleTabClick("theme")}
            >
              <ListItemIcon>
                <PaletteIcon />
              </ListItemIcon>
              <ListItemText primary="Theme" />
            </ListItem>
            <ListItem
              button
              selected={activeTab === "security"}
              onClick={() => handleTabClick("security")}
            >
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText primary="Security" />
            </ListItem>
            {/* Add more tabs here */}
          </List>
        </Col>

        {/* Right-side Content */}
        <Col md={9}>
          <Box p={3}>
            {/* Profile Section */}
            {activeTab === "profile" && (
              <>
                <h2>Profile Settings</h2>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <form onSubmit={handleSubmitProfile}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={profile.username}
                      onChange={handleProfileChange}
                      margin="normal"
                      variant="outlined"
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      margin="normal"
                      variant="outlined"
                    />
                    <TextField
                      select
                      fullWidth
                      label="Role"
                      name="role"
                      value={profile.role}
                      onChange={handleProfileChange}
                      margin="normal"
                      variant="outlined"
                    >
                      <MenuItem value="Parent">Parent</MenuItem>
                      <MenuItem value="Children">Children</MenuItem>
                    </TextField>
                    {error && <div className="text-danger mt-3">{error}</div>}
                    {success && (
                      <div className="text-success mt-3">{success}</div>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                    >
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </form>
                )}
              </>
            )}

            {/* Theme Section */}
            {activeTab === "theme" && (
              <>
                <h2>Theme Settings</h2>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <span>Dark Mode</span>
                  <Switch
                    checked={theme === "dark"}
                    onChange={handleThemeChange}
                    color="primary"
                  />
                </Box>
              </>
            )}
          </Box>
        </Col>
      </Row>
    </Container>
  );
};

export default SettingsPage;
