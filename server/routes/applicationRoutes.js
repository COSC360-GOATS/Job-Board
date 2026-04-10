import { Router } from "express";
import applicationController from "../controllers/applicationController.js";
import applicationService from "../services/applicationService.js";

export default function applicationRoutes(db) {
    const service = applicationService(db);
    const controller = applicationController(service);
    const router = Router();

    router.get("/", controller.getAll);
    router.get("/applicant/:applicantId", controller.getByApplicantId);
    router.get("/:id", controller.getById);
    router.post("/", controller.create);
    router.patch("/:id", controller.update);
    router.delete("/:id", controller.remove);

    return router;
}