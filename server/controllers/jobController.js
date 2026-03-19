import createController from "./controller.js";
import service from "../services/jobService.js";
import { readFileSync } from 'fs';
const jobs = JSON.parse(readFileSync(new URL('../data/jobs.json', import.meta.url)));

const controller = createController(service);

const searchJobs = (req, res) => {
    const query = req.query.q?.toLowerCase() || "";
    const results = jobs.filter(job =>
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query)
    );
    res.json(results);
  }; 

export default controller;
export { searchJobs };