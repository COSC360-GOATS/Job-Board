import createController from "./controller.js";
import service from "../services/jobService.js";

const controller = createController(service);

export default controller;