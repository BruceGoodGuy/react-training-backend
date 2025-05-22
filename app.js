require("dotenv").config();
const express = require("express");
const cors = require("cors");
const protectedRoutes = require("./routes/protectedRoutes");
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_APP || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/a/", protectedRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
