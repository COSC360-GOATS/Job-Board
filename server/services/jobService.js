import createService from './service.js';
import { ObjectId } from "mongodb";

export default function jobService(db) {
    const collection = db.collection('jobs');
    const service = createService(collection);

    return {
        ...service,

        async getByEmployerId(employerId) {
            if (!ObjectId.isValid(employerId)) return [];
            return await collection.find({ employerId: employerId }).toArray();
        },

        async getApplicationsForJob(jobId) {
            const applications = await db.collection('applications')
                .find({ jobId: jobId })
                .toArray();

            return await Promise.all(
                applications.map(async (app) => {
                    try {
                        const applicantId = new ObjectId(app.applicantId);
                        const applicant = await db.collection('applicants').findOne({ _id: applicantId });
                        return {
                            ...app,
                            applicant: applicant || null
                        };
                    } catch (e) {
                        return { ...app, applicant: null };
                    }
                })
            );
        }
    }
}