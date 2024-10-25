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
    origin: "https://notesapp-jade.vercel.app",
  })
);

// use Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Task manager API is working",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
