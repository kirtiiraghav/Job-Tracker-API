const express = require("express");
const {
  getApplications,
  getApplicationById,
  getStats,
  createApplication
} = require("../controllers/applications.controller");

const router = express.Router();

// Get all applications
router.get("/", getApplications);

// Get stats
router.get("/stats", getStats)

// Get a single application by id
router.get("/:id", getApplicationById);

// Create a new application
router.post("/", createApplication)

// Partially update an application

// Delete an application 

module.exports = router;
