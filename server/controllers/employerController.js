import service from "../services/employerService.js";
import createController from "./controller.js";

const controller = createController(service);

export default controller;