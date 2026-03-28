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
            if (!ObjectId.isValid(jobId)) return [];
            const job = await collection.findOne({ _id: new ObjectId(jobId) });
            if (!job) return [];

            const applicationIds = job.applicationIds || [];
            const applications = await db.collection('applications').find({ _id: { $in: applicationIds.map(id => new ObjectId(id)) } }).toArray();

            return await Promise.all(
                applications.map(async (app) => {
                    const applicant = await db.collection('applicants').findOne({ _id: new ObjectId(app.applicantId) });

                    return {
                        ...app,
                        applicant: applicant || null
                    };
                })
            );
        }
    }
}