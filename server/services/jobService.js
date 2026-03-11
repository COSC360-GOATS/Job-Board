const jobs = require('../data/jobs.json');

const getAllJobs = () => jobs;
const getJobById = (id) => jobs.find(j => j.id === parseInt(id));

module.exports = { getAllJobs, getJobById };