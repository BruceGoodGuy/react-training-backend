require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));

// Khởi động server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});