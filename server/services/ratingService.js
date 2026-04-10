import { ObjectId } from "mongodb";
import createService from "./service.js";

export default function ratingService(db) {
    const collection = db.collection('ratings');
    const service = createService(collection);
    return {
        ...service,

        async create(payload) {
            if (!ObjectId.isValid(payload.employerId)) {
                const error = new Error('Invalid employer id');
                error.statusCode = 400;
                throw error;
            }
            const employer = await db.collection('employers').findOne({ _id: new ObjectId(payload.employerId) });
            if (!employer) {
                const error = new Error('Employer not found');
                error.statusCode = 404;
                throw error;
            }

            if (!ObjectId.isValid(payload.applicantId)) {
                const error = new Error('Invalid applicant id');
                error.statusCode = 400;
                throw error;
            }
            const applicant = await db.collection('applicants').findOne({ _id: new ObjectId(payload.applicantId) });
            if (!applicant) {
                const error = new Error('Applicant not found');
                error.statusCode = 404;
                throw error;
            }

            const existingRating = await collection.findOne({
                employerId: payload.employerId,
                applicantId: payload.applicantId
            });
            if (existingRating) {
                const error = new Error('You have already rated this employer');
                error.statusCode = 409;
                throw error;
            }

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