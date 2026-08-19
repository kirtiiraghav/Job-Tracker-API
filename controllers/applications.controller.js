const { application } = require("express");
const fs = require("fs");
const path = require("path");

const DATA_FILE_PATH = path.join(__dirname, "..", "data.json");

const getApplications = (req, res) => {
  fs.readFile(DATA_FILE_PATH, "utf-8", (err, data) => {
    if (err) throw err;
    const applications = JSON.parse(data);
    res.status(200).json({ success: true, data: applications });
  });
};

module.exports = { getApplications };
