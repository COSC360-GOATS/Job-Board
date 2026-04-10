import { ObjectId } from "mongodb";
import createService from "./service.js";

export default function ratingService(db) {
    const collection = db.collection('ratings');
    const service = createService(collection);
    return {
        ...service,

        async getAll() {
            const ratings = await service.getAll();
            return await Promise.all(
                ratings.map(async (rating) => {
                    let applicant = null;
                    let employer = null;
                    try {
                        if (rating.applicantId && ObjectId.isValid(rating.applicantId)) {
                            applicant = await db.collection('applicants').findOne({ _id: new ObjectId(rating.applicantId) });
                        }
                        if (rating.employerId && ObjectId.isValid(rating.employerId)) {
                            employer = await db.collection('employers').findOne({ _id: new ObjectId(rating.employerId) });
                        }
                    } catch (e) {}

                    let applicantName = rating.applicantId;
                    if (applicant) {
                        const first = typeof applicant.firstName === 'object' ? applicant.firstName.first : applicant.firstName;
                        const last = typeof applicant.lastName === 'object' ? applicant.lastName.last : applicant.lastName;
                        applicantName = `${first || ''} ${last || ''}`.trim() || applicant.email;
                    }

                    let employerName = rating.employerId;
                    if (employer) {
                        employerName = employer.name || employer.companyName || employer.email;
                    }

                    return { ...rating, applicantName, employerName };
                })
            );
        },

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