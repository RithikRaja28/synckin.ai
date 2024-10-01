import React from "react";
import { Typography, Button } from "@mui/material";

const HomeDecorComponent = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5">Home Decor AI</Typography>
      <Typography variant="body1" style={{ margin: "20px 0" }}>
        Upload a picture of your room and let HomeGenie AI suggest decorations!
      </Typography>
      <Button variant="contained" color="primary">
        Upload Room Picture
      </Button>
    </div>
  );
};

export default HomeDecorComponent;
