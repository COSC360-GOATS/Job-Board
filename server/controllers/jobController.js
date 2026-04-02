import createController from "./controller.js";

export default function jobController(service) {
    const controller = createController(service);

    return {
        ...controller,

        async getByEmployerId(req, res) {
            try {
                const jobs = await service.getByEmployerId(req.params.employerId);
                return res.status(200).json(jobs);
            } catch (error) {
                return res.status(400).json({ error: "Invalid employer id format" });
            }
        }
    }
}