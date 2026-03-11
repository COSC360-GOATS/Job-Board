import {
    getApplicationService,
    getApplicationByIdService,
    createApplicationService,
    updateApplicationService,
    deleteApplicationService
} from "../services/applicationService.js";

export async function createApplication(req, res) {
    try {
        const { jobId, applicantId } = req.body;
        const application = await createApplicationService(jobId, applicantId);

        if (!application) {
            return res.status(400).json({ error: "Failed to create application" });
        }

        return res.status(201).json(application);

    } catch (error) {
        return res.status(500).json({ error: "Failed to create application" });
    }
}

export async function getApplications(req, res) {
    try {
        const applications = await getApplicationService();

        if (!applications) {
            return res.status(404).json({ error: "No applications found" });
        }

        return res.status(200).json(applications);
    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve applications" });
    }
}

export async function getApplicationById(req, res) {
    try {
        const { id } = req.params;
        const application = await getApplicationByIdService(id);

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        return res.status(200).json(application);
    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve applications" });
    }
}

export async function updateApplication(req, res) {
    try {
        const { id } = req.params;
        const { jobId, applicantId } = req.body;

        const updated = await updateApplicationService(id, jobId, applicantId);

        if (!updated) {
            return res.status(404).json({ error: "Application not found" });
        }

        return res.status(200).json({ message: "Application updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to update application" });
    }
}

export async function deleteApplication(req, res) {
    try {
        const { id } = req.params;
        const deleted = await deleteApplicationService(id);

        if (!deleted) {
            return res.status(404).json({ error: "Application not found" });
        }

        return res.status(200).json({ message: "Application deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete application" });
    }
}