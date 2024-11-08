import React, { useState } from "react";
import {
  Typography,
  Button,
  CircularProgress,
  TextField,
  Card,
  CardMedia,
  Alert,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const HomeDecorComponent = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Added progress state
  const [decoratedImage, setDecoratedImage] = useState(null);
  const [error, setError] = useState(null);

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
    setProgress(0); // Reset progress
    setError(null); // Clear any previous error

    // Create FormData to send image and description
    const formData = new FormData();
    formData.append("image", image);
    formData.append("prompt", description);

    try {
      // API call to the backend endpoint with progress tracking
      const response = await axios.post(
        "http://localhost:5000/api/homegenie/generate-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted); // Update progress
          },
        }
      );
      setDecoratedImage(response.data.imageUrl); // Store the image URL
    } catch (error) {
      console.error("Error generating AI image", error);
      setError("Failed to generate the decorated room. Please try again."); // Set error message
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={24} style={{ marginRight: "10px" }} />
                Generating...
              </>
            ) : (
              "Generate AI Decor"
            )}
          </Button>
        </div>

        {/* Progress Indicator */}
        {loading && (
          <div className="mt-3">
            <Typography variant="body2" className="text-center">
              Uploading... {progress}%
            </Typography>
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        )}

        {/* Display Error Message */}
        {error && (
          <Alert severity="error" className="mt-3 text-center">
            {error}
          </Alert>
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
