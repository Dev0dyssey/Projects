require("dotenv").config(); // Load environment variables FIRST
const app = require("./src/app"); // Import the Express app

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
