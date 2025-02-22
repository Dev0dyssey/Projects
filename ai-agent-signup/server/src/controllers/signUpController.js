const openaiService = require("../services/openaiService");

const handleSignupStep = async (req, res, next) => {
  const userMessage = req.body.message;

  try {
    const aiResponse = await openaiService.getOpenAIResponse(userMessage);
    return res.json(aiResponse);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};

module.exports = { handleSignupStep };
