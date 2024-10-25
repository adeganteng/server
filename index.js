const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

require("dotenv").config();
require("./db");

const PORT = process.env.PORT || 8000;
const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

// use Routes
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Task manager API is working",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
