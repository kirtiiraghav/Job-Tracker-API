const express = require("express");
const {
  getApplications,
  getApplicationById,
  getStats,
  createApplication, 
  updateApplication
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
router.patch("/:id", updateApplication)

// Delete an application 

module.exports = router;
