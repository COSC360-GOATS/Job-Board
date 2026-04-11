import createController from "./controller.js";

export default function applicationController(service, emitEvent = () => {}) {
    const baseController = createController(service);

    return {
        ...baseController,

        async create(req, res) {
            try {
                const created = await service.create(req.body);
                emitEvent('application-created', {
                    applicationId: created?._id,
                    jobId: created?.jobId,
                    applicantId: created?.applicantId,
                    submittedAt: created?.submittedAt || created?.createdAt || new Date().toISOString(),
                });
                return res.status(201).json(created);
            }
            catch (err) {
                const statusCode = err.statusCode || 500;
                const message = err.message || "Failed to create item";
                return res.status(statusCode).json({ message });
            }
        },
    };
}