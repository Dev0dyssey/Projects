#!/bin/bash

# Start the server
npm run start:server &

# Wait for the server to start
sleep 5

# Start the frontend
PORT=4000 npm start