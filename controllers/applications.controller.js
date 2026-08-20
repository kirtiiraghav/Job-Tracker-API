const { application } = require("express");
const { networkInterfaces } = require("os");
const fs = require("fs").promises;
const path = require("path");

const DATA_FILE_PATH = path.join(__dirname, "..", "data.json"); // or "../data.json"

const readData = async () => {
  const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
  return JSON.parse(raw);
};

const writeData = (application) => {
  fs.writeFile(DATA_FILE_PATH, JSON.stringify(application, null, 2));
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

const createApplication = async (req, res) => {
  const data = await readData();
  let applications = data.applications;

  const { company, role, status } = req.body;

  if (!company || !role) {
    sendError(res, 400, false, "Company and role are required");
    return;
  }

  const id =
    applications.length > 0
      ? Math.max(...applications.map((a) => a.id)) + 1
      : 1;

  const newApplication = {
    id,
    company,
    role,
    status: status || "applied",
  };
  applications = [...applications, newApplication];

  writeData({ applications });
  sendSuccess(res, 201, true, newApplication);
};

const updateApplication = async (req, res) => {
  const data = await readData();
  let applications = data.applications;

  const id = Number(req.params.id);
  const updates = req.body;

  const application = applications.find((a) => a.id === id);

  if (!application) {
    sendError(res, 400, false, `Application #${id} doesn't exist`);
    return;
  }

  // Only update fields that were sent
  if (updates.company !== undefined) {
    application.company = updates.company;
  }

  if (updates.role !== undefined) {
    application.role = updates.role;
  }

  if (updates.status !== undefined) {
    application.status = updates.status;
  }

  writeData({ applications });

  sendSuccess(res, 200, true, application);
};

module.exports = {
  getApplications,
  getApplicationById,
  getStats,
  createApplication,
  updateApplication,
};
