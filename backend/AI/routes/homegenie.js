const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk"); // Import the Groq SDK
require("dotenv").config();

const groq = new Groq(); // Initialize the Groq SDK
const MAX_RETRIES = 3; // Number of retries
const RETRY_DELAY = 1000; // Delay in milliseconds

router.post("/suggestions", async (req, res) => {
  const { query } = req.body;

  const formattedQuery = `Acts an Architect,Designer, Developer, Home Maker suggest some best suggestions for the given context. Here is the context: "${query}"`;

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
        model: "llama3-8b-8192", // Specify your model
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

module.exports = router;
