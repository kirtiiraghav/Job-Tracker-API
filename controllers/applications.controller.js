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

const sendError = (res, status, success, message) => {
  res.status(status).json({ success, message });
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
  const { id } = req.params;

  const ID = Number(id);
  const application = data.applications.find((app) => app.id === ID);

  if (!application) {
    sendError(res, 404, false, `Application not found for id: ${id}`);
  } else {
    sendSuccess(res, 200, true, application);
  }
};

const getStats = async (req, res) => {
  const data = await readData();
  const applications = data.applications;

  const stats = {};
  for (let app of applications) {
    stats[app.status] = (stats[app.status] || 0) + 1;
  }

  stats["total"] = applications.length;
  sendSuccess(res, 200, true, stats);
};

module.exports = { getApplications, getApplicationById, getStats };
