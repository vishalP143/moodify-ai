// 1. CRITICAL FIX: Load .env variables BEFORE importing anything else
const dotenv = require('dotenv');
dotenv.config(); 

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 

// 2. NOW it is safe to import routes (because .env is loaded)
const entryRoutes = require('./routes/entryRoutes');

// Connect to Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/entries', entryRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});