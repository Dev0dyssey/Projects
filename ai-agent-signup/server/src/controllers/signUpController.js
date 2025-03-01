const openaiService = require("../services/openaiService");
const Database = require("better-sqlite3");

const db = new Database("./db.sqlite3");

const handleSignupStep = async (req, res, next) => {
  const userMessage = req.body.message;

  try {
    const aiResponse = await openaiService.getOpenAIResponse(userMessage);
    return res.json(aiResponse);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};

const checkCompany = (req, res, next) => {
  const companyName = req.params.companyName;

  try {
    const stmt = db.prepare(
      "SELECT * FROM companies WHERE companyName = @companyName"
    );
    const row = stmt.get({ companyName: companyName });

    if (row) {
      return res.json({ exists: true, company: row });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { handleSignupStep, checkCompany };
