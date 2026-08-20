const { application } = require("express");
const fs = require("fs").promises;
const path = require("path");

const DATA_FILE_PATH = path.join(__dirname, "..", "data.json"); // or "../data.json"

const readData = async () => {
  const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
  return JSON.parse(raw);
};

const writeData = (applications) => {
  fs.writeFile(DATA_FILE_PATH, JSON.stringify(data), null, 2);
};

const sendSuccess = (res, status, success, data) => {
  res.status(status).json({ success, data });
};

// status, sort, page, limit
const getApplications = async (req, res) => {
  const data = await readData();
  let applications = data.applications;

  const { status, sort, page, limit } = req.query;

  if (status) {
    applications = applications.filter(
      (application) => application.status === status,
    );
  }

  if (sort === "company") {
    applications.sort((a, b) => a.company.localeCompare(b.company));
  }

  if (page && limit) {
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const start = (pageNum - 1) * limitNum;
    applications = applications.slice(start, start + limit);
  }

  sendSuccess(res, 200, true, applications);
};

const getApplicationById = async (req, res) => {
  const data = await readData();
  let applications = data.applications;

  const { id } = req.params;

  if (id) {
    const ID = Number(id);
    applications = applications.filter((app) => app.id === ID);
  }

  sendSuccess(res, 200, true, applications);
};

module.exports = { getApplications, getApplicationById };
