import { Router } from "express";
import { 
    getApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    deleteApplication
} from "../controllers/applicationController.js";

const router = Router();

router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.post("/", createApplication);
router.patch("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;