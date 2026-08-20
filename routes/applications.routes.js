const express = require("express");
const {
  getApplications,
  getApplicationById,
  getStats
} = require("../controllers/applications.controller");

const router = express.Router();

// Get all applications
router.get("/", getApplications);

// Get stats
router.get("/stats", getStats)

// Get a single application by id
router.get("/:id", getApplicationById);

module.exports = router;
