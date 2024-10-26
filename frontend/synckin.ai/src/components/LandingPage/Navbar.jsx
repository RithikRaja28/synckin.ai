import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Container } from "react-bootstrap";

const Navbar = () => {
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#1a1a1a", padding: "10px" }}
    >
      <Container>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Synckin.ai
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            href="/login"
            sx={{ marginLeft: "20px" }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            href="/register"
            sx={{ marginLeft: "20px" }}
          >
            Register
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
