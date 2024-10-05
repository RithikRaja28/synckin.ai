import React, { useState } from "react";
import {
  Typography,
  Button,
  CircularProgress,
  TextField,
  Card,
  CardMedia,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const HomeDecorComponent = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [decoratedImage, setDecoratedImage] = useState(null);

  // Handle image upload
  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  // Handle form submission to trigger AI decoration
  const handleSubmit = async () => {
    if (!image || !description) {
      alert("Please upload an image and provide a description.");
      return;
    }
    setLoading(true);

    // Create FormData to send image and description
    const formData = new FormData();
    formData.append("image", image);
    formData.append("description", description);

    try {
      // API call to the backend endpoint
      const response = await axios.post("/api/decorate-room", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setDecoratedImage(response.data.decoratedImage);
    } catch (error) {
      console.error("Error generating AI image", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <Card className="p-4 shadow-sm">
        <Typography variant="h5" className="mb-3 text-center">
          Home Decor AI
        </Typography>
        <Typography variant="body1" className="mb-4 text-center">
          Upload a picture of your room and let HomeGenie AI suggest
          decorations!
        </Typography>

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "block", margin: "10px auto" }}
        />

        {/* Description Input */}
        <TextField
          label="Describe your desired decor style"
          variant="outlined"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-3"
        />

        {/* Submit Button */}
        <div className="text-center">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {loading ? <CircularProgress size={24} /> : "Generate AI Decor"}
          </Button>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center mt-3">
            <Typography variant="body1">
              Generating decorated room, please wait...
            </Typography>
          </div>
        )}

        {/* Display the AI-Generated Image */}
        {decoratedImage && (
          <div className="mt-4 text-center">
            <CardMedia
              component="img"
              image={decoratedImage}
              alt="AI Decorated Room"
              className="rounded"
              style={{ maxWidth: "100%", maxHeight: "500px" }}
            />
            <Typography variant="body2" className="mt-2">
              Your AI-decorated room
            </Typography>
          </div>
        )}
      </Card>
    </div>
  );
};

export default HomeDecorComponent;
