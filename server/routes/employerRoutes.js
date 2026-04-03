import express from "express";
import employerController from "../controllers/employerController.js";
import employerService from "../services/employerService.js";

export default function employerRoutes(db) {
    const service = employerService(db);
    const controller = employerController(service);
    const router = express.Router();

    router.get("/", controller.getAll);
    router.get("/:id", controller.getById);
    router.post("/", controller.create);
    router.patch("/:id", controller.update);
    router.delete("/:id", controller.remove);

    return router;
}