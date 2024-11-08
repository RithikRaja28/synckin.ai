import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Snackbar,
  Grid,
  Box,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import ReactMarkdown from "react-markdown";
// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  margin: "20px 0",
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
  borderRadius: "10px",
  backgroundColor: theme.palette.background.paper,
}));

const RecipeGeneratorAI = () => {
  const [ingredients, setIngredients] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [dietaryPreferences, setDietaryPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleGenerateRecipe = async () => {
    if (!ingredients) {
      setError("Ingredients are required to create a recipe.");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/homegenie/generate-recipe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ingredients, cuisine, dietaryPreferences }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate recipe");
      }

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      setError(error.message);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "40px" }}>
      <Typography variant="h5" align="center" gutterBottom>
        Create your Recipe 
      </Typography>

      <StyledCard>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Ingredients (comma-separated)"
                variant="outlined"
                fullWidth
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cuisine (optional)"
                variant="outlined"
                fullWidth
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Dietary Preferences (optional)"
                variant="outlined"
                fullWidth
                value={dietaryPreferences}
                onChange={(e) => setDietaryPreferences(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleGenerateRecipe}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Generate Recipe"
                )}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      {recipe && (
        <StyledCard>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Generated Recipe
            </Typography>
            <Typography variant="body1"><ReactMarkdown>{recipe}</ReactMarkdown></Typography>
          </CardContent>
        </StyledCard>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RecipeGeneratorAI;
