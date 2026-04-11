import { Router } from "express";
import applicationController from "../controllers/applicationController.js";
import applicationService from "../services/applicationService.js";

export default function applicationRoutes(db, emitEvent) {
    const service = applicationService(db);
    const controller = applicationController(service, emitEvent);
    const router = Router();

    router.get("/", controller.getAll);
    router.get("/:id", controller.getById);
    router.post("/", controller.create);
    router.patch("/:id", controller.update);
    router.delete("/:id", controller.remove);

    return router;
}