const express = require("express");
const cors = require("cors");
const signupController = require("./controllers/signupController");
const errorHandler = require("./utils/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.post("/api/echo", signupController.handleSignupStep);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
