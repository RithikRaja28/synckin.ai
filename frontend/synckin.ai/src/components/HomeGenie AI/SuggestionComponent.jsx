import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Card, Typography } from "@mui/material";
import ScrollableFeed from "react-scrollable-feed";
import "./SuggestionComponent.css"; // For custom styling

const SuggestionComponent = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]); // Array to hold the chat history

  const handleSubmit = async () => {
    if (!query.trim()) return; // Avoid sending empty queries

    // Add user query to chat
    setMessages([...messages, { type: "user", text: query }]);

    try {
      const response = await axios.post("/api/homegenie/suggestions", {
        query,
      });
      const aiResponse = response.data.suggestions;

      // Add AI response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "ai", text: aiResponse },
      ]);
    } catch (error) {
      console.error("Error fetching suggestions", error);
    }

    setQuery(""); // Clear the input field
  };

  return (
    <div className="chat-container">
      <Typography variant="h5" style={{ marginBottom: "20px" }}>
        Chat with HomeGenie AI
      </Typography>

      <div className="chat-box">
        <ScrollableFeed className="scrollable-feed">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              <Card className={`message-card ${msg.type}`}>
                <Typography variant="body1">{msg.text}</Typography>
              </Card>
            </div>
          ))}
        </ScrollableFeed>
      </div>

      <div className="input-area">
        <TextField
          label="Type your query"
          variant="outlined"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!query.trim()} // Disable if input is empty
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default SuggestionComponent;
