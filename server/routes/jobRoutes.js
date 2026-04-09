import { Router } from 'express';
import jobController from '../controllers/jobController.js';
import jobService from '../services/jobService.js';
import validateRequest from '../middleware/validateRequest.js';
import { createJobSchema, updateJobSchema } from '../validators/jobValidator.js';

export default function jobRoutes(db) {
    const service = jobService(db);
    const controller = jobController(service);
    const router = Router();

    router.get("/", controller.getAll);
    router.get("/recommendations/:applicantId", controller.getRecommendationsForApplicant);
    router.get("/employer/:employerId", controller.getByEmployerId);
    router.get("/:id", controller.getById);
    router.post("/", validateRequest(createJobSchema), controller.create);
    router.patch("/:id", validateRequest(updateJobSchema), controller.update);
    router.delete("/:id", controller.remove);
    router.get("/:id/applications", controller.getApplicationsForJob);
    router.post("/:id/applications/read", controller.markApplicationsAsRead);

    return router;
}