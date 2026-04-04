import { ObjectId } from "mongodb";
import createService from "./service.js";

export default function ratingService(db) {
    const collection = db.collection('ratings');
    const service = createService(collection);
    return {
        ...service,

        async create(payload) {
            return await service.create(payload, { employerId: payload.employerId, applicantId: payload.applicantId });
        },

        async getByEmployerId(employerId) {
            if (!ObjectId.isValid(employerId)) return [];
            const ratings = await collection.find({ employerId: employerId }).toArray();
            
            return await Promise.all(
                ratings.map(async (rating) => {
                    try {
                        const applicant = await db.collection('applicants').findOne({ _id: new ObjectId(rating.applicantId) });
                        return {
                            ...rating,
                            applicant: applicant || null
                        };
                    } catch (e) {
                        return {
                            ...rating,
                            applicant: null
                        };
                    }
                })
            );
        },

        async getAvgRatingForEmployer(employerId) {
            const ratings = await this.getByEmployerId(employerId);
            if (ratings.length === 0) return null;
            const total = ratings.reduce((sum, r) => sum + r.rating, 0);
            return total / ratings.length;
        }
    }
}