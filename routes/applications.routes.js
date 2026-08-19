const express = require("express");
const { getApplications } = require("../controllers/applications.controller");

const router = express.Router();

// get all applications
router.get("/", getApplications);

module.exports = router;
