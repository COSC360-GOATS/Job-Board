const { getAllJobs, getJobById } = require('../services/jobService');

const getJobs = (req, res) => res.json(getAllJobs());
const getJob = (req, res) => {
  const job = getJobById(req.params.id);
  job ? res.json(job) : res.status(404).json({ message: "Job not found" });
};

module.exports = { getJobs, getJob };