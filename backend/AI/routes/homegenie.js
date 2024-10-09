const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk"); // Import the Groq SDK
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const sharp = require("sharp");
require("dotenv").config();

// Initialize Groq SDK
const groq = new Groq();
const MAX_RETRIES = 3; // Number of retries for Groq suggestions
const RETRY_DELAY = 1000; // Delay in milliseconds before retrying

// Multer middleware for handling image uploads
const upload = multer({ storage: multer.memoryStorage() });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Endpoint for generating images
router.post("/generate-image", upload.single("image"), async (req, res) => {
  console.log("Received Image:", req.file); // Log the uploaded image
  console.log("Received Prompt:", req.body.prompt);

  const prompt = req.body.prompt;

  if (!req.file || !prompt) {
    return res.status(400).json({ error: "Image and prompt are required" });
  }

  try {
    // Generate a mask that covers the entire image
    const maskBuffer = await sharp(req.file.buffer)
      .resize(1024, 1024) // Resize to match expected size
      .raw({
        // Create a mask with a fully transparent background
        raw: {
          width: 1024,
          height: 1024,
          channels: 1, // Single channel for mask (black and white)
        },
      })
      .toBuffer();

    // Create a readable stream from the image and mask buffers
    const imageBase64 = req.file.buffer.toString("base64");
    const maskBase64 = maskBuffer.toString("base64");

    // Create FormData instance
    const form = new FormData();
    form.append("model", "dall-e-2");
    form.append("image", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    form.append("mask", maskBuffer, {
      filename: "mask.png", // Name for the mask file
      contentType: "image/png",
    });
    form.append("prompt", prompt);
    form.append("n", 1); // Number of images to generate
    form.append("size", "1024x1024"); // Image size

    // Make the request to the OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/images/edits",
      form,
      {
        headers: {
          ...form.getHeaders(), // Use form headers for multipart
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        timeout: 240000,
      }
    );

    // Extract the generated image URL
    const imageUrl = response.data.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    console.error(
      "Error generating image:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to generate image" });
  }
});

// Route to get AI suggestions for room decor
router.post("/suggestions", async (req, res) => {
  const { query } = req.body;

  // Formatted query for AI suggestions
  const formattedQuery = `Act as an Architect, Designer, Developer, and Home Maker. Suggest some of the best decorations for the following context: "${query}"`;

  // Retry logic for AI suggestions from Groq
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Create a chat completion request using Groq
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: formattedQuery,
          },
        ],
        model: "llama3-8b-8192", // Specify your Groq model here
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: true,
      });

      // Collect the response in chunks
      let suggestions = "";
      for await (const chunk of chatCompletion) {
        suggestions += chunk.choices[0]?.delta?.content || "";
      }

      return res.json({ suggestions: suggestions.trim() }); // Send the final suggestions back to the client
    } catch (error) {
      console.error("Error fetching AI suggestions:", error.message);
      if (error.code === "ENOTFOUND") {
        return res.status(500).json({
          error: "API endpoint not found. Please check the endpoint URL.",
        });
      }
      if (attempt === MAX_RETRIES - 1) {
        return res.status(500).json({ error: "Failed to fetch suggestions" });
      }
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
});

router.post("/generate-shopping-list", async (req, res) => {
  const { input } = req.body; // Input could be a recipe, meal plan, or detected low items

  if (!input) {
    return res
      .status(400)
      .json({ error: "Input is required to generate a shopping list" });
  }

  try {
    // Construct a query to the AI to generate a shopping list
    const formattedQuery = `Based on the following input: "${input}", generate a shopping list with common groceries and ingredients required for the following context and that should be necessary.`;

    // Retry logic for AI suggestions from Groq
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        // Create a chat completion request using Groq
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: formattedQuery,
            },
          ],
          model: "llama3-8b-8192", // Specify Groq model
          temperature: 1,
          max_tokens: 1024,
          top_p: 1,
          stream: true,
        });

        // Collect the response in chunks
        let shoppingList = "";
        for await (const chunk of chatCompletion) {
          shoppingList += chunk.choices[0]?.delta?.content || "";
        }

        // Send the final shopping list back to the client
        return res.json({ shoppingList: shoppingList.trim() });
      } catch (error) {
        console.error("Error generating shopping list:", error.message);
        if (attempt === MAX_RETRIES - 1) {
          return res
            .status(500)
            .json({ error: "Failed to generate shopping list" });
        }
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/generate-recipe", async (req, res) => {
  const { ingredients, cuisine, dietaryPreferences } = req.body;

  if (!ingredients) {
    return res
      .status(400)
      .json({ error: "Ingredients are required to create a recipe" });
  }

  try {
    // Construct a query to the AI model to create a recipe
    let formattedQuery = `Create a recipe using the following ingredients and suggest some youtube links for the following context: "${ingredients}".`;

    if (cuisine) {
      formattedQuery += ` The recipe should be for ${cuisine} cuisine.`;
    }

    if (dietaryPreferences) {
      formattedQuery += ` Make sure it fits within these dietary preferences: ${dietaryPreferences}.`;
    }

    // Retry logic for AI suggestions from Groq
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        // Create a chat completion request using Groq or another model
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: formattedQuery,
            },
          ],
          model: "llama3-8b-8192", // Groq model
          temperature: 0.7,
          max_tokens: 1024,
          top_p: 1,
          stream: true,
        });

        // Collect the response in chunks
        let recipe = "";
        for await (const chunk of chatCompletion) {
          recipe += chunk.choices[0]?.delta?.content || "";
        }

        // Send the generated recipe back to the client
        return res.json({ recipe: recipe.trim() });
      } catch (error) {
        console.error("Error generating recipe:", error.message);
        if (attempt === MAX_RETRIES - 1) {
          return res.status(500).json({ error: "Failed to generate recipe" });
        }
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
