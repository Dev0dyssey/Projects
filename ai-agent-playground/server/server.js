const express = require("express");
const path = require("path");
const axios = require("axios");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../dist/ai-agent-playground")));

app.post("/api/agent", async (req, res) => {
  const { prompt, reactHistory } = req.body;
  const fullPrompt = `${prompt} ${reactHistory}`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        messages: [
          {
            role: "user",
            content: fullPrompt,
          },
        ],
        model: "gpt-4o",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    console.log("OPEN AI RESPONSE", response.data.choices[0].message.content);
    res.send(response.data);
  } catch (error) {
    console.error("Open AI error", error);
    res.status(500).send({ message: "Error with calling OpenAI API" });
  }
});

app.get("/api/hello", (req, res) => {
  res.send({ message: "Hello from the server!" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/ai-agent-playground/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
