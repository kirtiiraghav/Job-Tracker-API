const express = require("express");
const applicationsRouter = require("./routes/applications.routes");
const app = express();

app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Home page
app.get("/", (req, res) => {
  res.send("Welcome to Job Tracker API");
});

// Handles all /applications routes
app.use("/applications", applicationsRouter);

// 404s
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: "Route not found" });
  next();
});

// Error handling
app.use((err, req, res, next) => {
  console.log("err", err);
  res.status(500).json({ success: false, error: "Internal server error" });
  next();
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});
