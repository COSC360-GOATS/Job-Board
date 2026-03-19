import {
    getApplicantService,
    getApplicantByIdService,
    createApplicantService,
    updateApplicantService,
    deleteApplicantService
} from "../services/applicantService.js";

export async function createApplicant(req, res) {
    try {
        const { name, email } = req.body;
        const applicant = await createApplicantService({ name, email });

        if (!applicant) {
            return res.status(400).json({ error: "Failed to create applicant" });
        }

        return res.status(201).json(applicant);

    } catch (error) {
        return res.status(500).json({ error: "Failed to create applicant" });
    }
}

export async function getApplicants(req, res) {
    try {
        const applicants = await getApplicantService();

        if (!applicants) {
            return res.status(404).json({ error: "No applicants found" });
        }

        return res.status(200).json(applicants);
    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve applicants" });
    }
}

export async function getApplicantById(req, res) {
    try {
        const { id } = req.params;
        const applicant = await getApplicantByIdService(id);
        
        if (!applicant) {
            return res.status(404).json({ error: "Applicant not found" });
        }

        return res.status(200).json(applicant);
    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve applicants" });
    }
}

export async function updateApplicant(req, res) {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const updated = await updateApplicantService(id, { name, email });

        if (!updated) {
            return res.status(404).json({ error: "Applicant not found" });
        }

        return res.status(200).json(updated);
    } catch (error) {
        return res.status(500).json({ error: "Failed to update applicant" });
    }
}

export async function deleteApplicant(req, res) {
    try {
        const { id } = req.params;
        const deleted = await deleteApplicantService(id);

        if (!deleted) {
            return res.status(404).json({ error: "Applicant not found" });
        }

        return res.status(200).json({ message: "Applicant deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete applicant" });
    }
}