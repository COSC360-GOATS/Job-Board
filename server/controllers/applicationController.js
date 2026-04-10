import createController from "./controller.js";

export default function applicationController(service) {
    const baseController = createController(service);

    return {
        ...baseController,
        async getByApplicantId(req, res) {
            try {
                const items = await service.getByApplicantId(req.params.applicantId);
                return res.status(200).json(items);
            } catch (err) {
                return res.status(500).json({ error: "Failed to fetch applications" });
            }
        }
    };
}