import { Router } from 'express';
import applicantController from '../controllers/applicantController.js';
import applicantService from '../services/applicantService.js';

export default function applicantRoutes(db) {
    const service = applicantService(db);
    const controller = applicantController(service);
    const router = Router();

    router.get("/", controller.getAll);
    router.get("/:id", controller.getById);
    router.post("/", controller.create);
    router.patch("/:id", controller.update);
    router.delete("/:id", controller.remove);

    return router;
}