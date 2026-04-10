import { Router } from "express";
import ratingController from "../controllers/ratingController.js";
import ratingService from "../services/ratingService.js";

export default function ratingRoutes(db, emitEvent) {
    const service = ratingService(db);
    const controller = ratingController(service, emitEvent);
    const router = Router();

    router.get("/", controller.getAll);
    router.get("/employer/:employerId/avg", controller.getAvgRatingForEmployer);
    router.get("/employer/:employerId", controller.getByEmployerId);
    router.get("/:id", controller.getById);
    router.post("/", controller.create);
    router.put("/:id", controller.update);
    router.delete("/:id", controller.remove);

    return router;
}