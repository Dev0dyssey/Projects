const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/echo", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant designed to output JSON. You are assisting new users of our platform through the signup process.",
        },
        { role: "user", content: userMessage },
      ],
      model: "gpt-4o",
      response_format: { type: "json_object" },
    });

    const parsedResponse = JSON.parse(completion.choices[0].message.content);
    console.log(parsedResponse);
    res.json(parsedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error communicating with OpenAI API" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
