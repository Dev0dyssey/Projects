const express = require('express');
const promMid = require('express-prometheus-middleware');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

// Function to generate the response schema for the /time endpoint
const getTimeResponseSchema = (epoch) => ({
    properties: {
      epoch: {
        description: "The current server time, in epoch seconds, at time of processing the request.",
        type: "number"
      }
    },
    required: [epoch],
    type: "object"
  });

// Prometheus middleware
app.use(promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
}));

// Middleware to validate Authorization header
const validateAuthHeader = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== 'mysecrettoken') {
    return res.sendStatus(403);
  }
  next();
};

// Enable CORS for all routes


// Route to get current server time in epoch seconds
app.get('/time', validateAuthHeader, (req, res) => {
    const epochTime = Math.floor(Date.now() / 1000);
    const response = {
      epoch: epochTime
    };
    res.json(getTimeResponseSchema(response).required);
  });

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});