const express = require("express");
const {
  getApplications,
  getApplicationById,
} = require("../controllers/applications.controller");

const router = express.Router();

// get all applications
router.get("/", getApplications);

// Get a single application by id
router.get("/:id", getApplicationById);

module.exports = router;
