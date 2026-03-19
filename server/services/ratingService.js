import createService from "./service.js";
import data from "../data/ratings.json" with { type: "json" };

const service = createService(data);

export default service;