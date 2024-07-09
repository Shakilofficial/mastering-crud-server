const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const cleanCoRoutes = require('./routes/cleanCoRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', cleanCoRoutes);

// Start the server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Clean Co server is running on port: ${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});
