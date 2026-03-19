import { Router } from 'express';

export default function applicantRoutes(controller) {
    const router = Router();

    router.get("/", controller.getAll);
    router.get("/:id", controller.getById);
    router.post("/", controller.create);
    router.patch("/:id", controller.update);
    router.delete("/:id", controller.remove);

    return router;
}