import createController from "./controller.js";
import service from "../services/ratingService.js";

const controller = createController(service);

export default controller;