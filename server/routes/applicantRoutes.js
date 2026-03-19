import { Router } from 'express';
import {
    getApplicants,
    getApplicantById,
    createApplicant,
    updateApplicant,
    deleteApplicant
} from "../controllers/applicantController.js";

const router = Router();

router.get("/", getApplicants);
router.get("/:id", getApplicantById);
router.post("/", createApplicant);
router.patch("/:id", updateApplicant);
router.delete("/:id", deleteApplicant);

export default router;