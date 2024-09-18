import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  CircularProgress,
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  MenuItem
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
  const [activeTab, setActiveTab] = useState("profile");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
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
    setActiveTab(tab);
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

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmitPasswordChange = async (e) => {
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
      await axios.put(
        "http://localhost:5000/auth/change-password",
        passwords,
        config
      );
      setSuccess("Password updated successfully!");
    } catch (err) {
      setError("Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="mt-5">
      <Row>
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
          </List>
        </Col>

        <Col md={9}>
          <Box p={3}>
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

            {/* Security Section */}
            {activeTab === "security" && (
              <>
                <h2>Security Settings</h2>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <form onSubmit={handleSubmitPasswordChange}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      name="currentPassword"
                      type="password"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                      margin="normal"
                      variant="outlined"
                    />
                    <TextField
                      fullWidth
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      margin="normal"
                      variant="outlined"
                    />
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
                        "Update Password"
                      )}
                    </Button>
                  </form>
                )}
              </>
            )}
          </Box>
        </Col>
      </Row>
    </Container>
  );
};

export default SettingsPage;
