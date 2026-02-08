const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
