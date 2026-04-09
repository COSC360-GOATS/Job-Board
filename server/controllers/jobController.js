import createController from "./controller.js";

export default function jobController(service) {
    const controller = createController(service);

    return {
        ...controller,

        async getByEmployerId(req, res) {
            try {
                const jobs = await service.getByEmployerId(req.params.employerId);
                return res.status(200).json(jobs);
            } catch {
                return res.status(400).json({ error: "Invalid employer id format" });
            }
        },

        async getRecommendationsForApplicant(req, res) {
            try {
                const jobs = await service.getRecommendationsForApplicant(req.params.applicantId);
                return res.status(200).json(jobs);
            } catch {
                return res.status(400).json({ error: "Invalid applicant id format" });
            }
        },

        async getApplicationsForJob(req, res) {
            try {
                const applications = await service.getApplicationsForJob(req.params.id);
                return res.status(200).json(applications);
            } catch {
                return res.status(400).json({ error: "Invalid job id format" });
            }
        },

        async markApplicationsAsRead(req, res) {
            try {
                const updatedJob = await service.markApplicationsAsRead(req.params.id);
                if (!updatedJob) return res.status(404).json({ error: "Job not found" });

                return res.status(200).json({
                    jobId: req.params.id,
                    applicationInboxLastViewedAt: updatedJob.applicationInboxLastViewedAt,
                });
            } catch {
                return res.status(400).json({ error: "Invalid job id format" });
            }
        }
    }
}