const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Import the DB logic
const entryRoutes = require('./routes/entryRoutes');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // Allows us to accept JSON data in the body

app.use('/api/entries', entryRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});