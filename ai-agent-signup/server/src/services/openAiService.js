const { OpenAI } = require("openai");
const { SYSTEM_PROMPT } = require("../../prompts/system-prompt");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const getOpenAIResponse = async (userMessage) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      { role: "user", content: userMessage || "" },
    ],
    model: "gpt-4o",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No content received from OpenAI API"); // Throw a standard Error
  }

  try {
    const parsedResponse = JSON.parse(content);
    console.log(parsedResponse);
    if (
      typeof parsedResponse === "object" ||
      (parsedResponse !== null && "message" in parsedResponse)
    ) {
      return parsedResponse;
    } else {
      let errorMessage = "AI response was not in the expected format.";
      if (typeof parsedResponse === "object" && parsedResponse !== null) {
        // Try to find *some* kind of message to salvage
        if ("definition" in parsedResponse) {
          errorMessage = parsedResponse.definition;
        } else if ("response" in parsedResponse) {
          errorMessage = parsedResponse.response;
        } else if ("text" in parsedResponse) {
          errorMessage = parsedResponse.text;
        }
      }
      throw new Error(errorMessage); // Throw error to central error handling
    }
  } catch (parseError) {
    console.error(`Error parsing JSON response: ${parseError}`);
    throw new Error("Error parsing JSON response"); // Re-throw as a standard Error
  }
};

module.exports = { getOpenAIResponse };
