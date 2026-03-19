import createController from "./controller.js";
import service from "../services/applicationService.js";

const controller = createController(service);

export default controller;