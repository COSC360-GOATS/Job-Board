import createController from "./controller.js";

export default function ratingController(service) {
    const baseController = createController(service);
    
    return {
        ...baseController,
        
        async getByEmployerId(req, res) {
            try {
                const ratings = await service.getByEmployerId(req.params.employerId);
                return res.status(200).json(ratings);
            }
            catch (err) {
                return res.status(500).json({ error: "Failed to fetch ratings" });
            }
        },

        async getByApplicantId(req, res) {
            try {
                const ratings = await service.getByApplicantId(req.params.applicantId);
                return res.status(200).json(ratings);
            }
            catch (err) {
                return res.status(500).json({ error: "Failed to fetch reviews" });
            }
        },
        
        async getAvgRatingForEmployer(req, res) {
            try {
                const avgRating = await service.getAvgRatingForEmployer(req.params.employerId);
                if (avgRating === null) {
                    return res.status(404).json({ message: "No ratings found for this employer" });
                }
                return res.status(200).json({ employerId: req.params.employerId, avgRating });
            }
            catch (err) {
                return res.status(500).json({ error: "Failed to calculate average rating" });
            }
        }
    }
}