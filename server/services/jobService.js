import createService from './service.js';
import { ObjectId } from "mongodb";

function toTimestamp(value) {
    if (!value) return 0;
    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
}

export default function jobService(db) {
    const collection = db.collection('jobs');
    const applicationsCollection = db.collection('applications');
    const service = createService(collection);

    return {
        ...service,

        async create(payload) {
            payload.isClosed = false;
            payload.applicationInboxLastViewedAt = payload.applicationInboxLastViewedAt || null;
            return await service.create(payload);
        },

        async getByEmployerId(employerId) {
            if (!ObjectId.isValid(employerId)) return [];
            const jobs = await collection.find({ employerId: employerId }).toArray();

            return await Promise.all(
                jobs.map(async (job) => {
                    const applications = await applicationsCollection.find({ jobId: job._id?.toString?.() || job._id }).toArray();
                    const lastViewedAt = job.applicationInboxLastViewedAt || null;
                    const lastViewedTimestamp = toTimestamp(lastViewedAt);

                    const unreadApplications = applications.filter((application) => {
                        const submittedAt = application?.submittedAt || application?.date || application?.createdAt;
                        return toTimestamp(submittedAt) > lastViewedTimestamp;
                    }).length;

                    return {
                        ...job,
                        unreadApplications,
                    };
                })
            );
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
        },

        async markApplicationsAsRead(jobId) {
            const nowIso = new Date().toISOString();

            await collection.updateOne(
                { _id: new ObjectId(jobId) },
                { $set: { applicationInboxLastViewedAt: nowIso } }
            );

            return await collection.findOne({ _id: new ObjectId(jobId) });
        }
    }
}