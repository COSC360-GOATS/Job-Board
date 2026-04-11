import { ObjectId } from 'mongodb';
import createService from './service.js';

export default function applicationService(db) {
    const service = createService(db.collection('applications'));

    return {
        ...service,

        async create(payload, checkExists) {
            const nowIso = new Date().toISOString();
            const normalizedPayload = {
                ...payload,
                submittedAt: payload?.submittedAt || payload?.date || payload?.createdAt || nowIso,
                createdAt: payload?.createdAt || nowIso,
                status: 'pending',
            };

            if (!ObjectId.isValid(normalizedPayload.jobId)) {
                const error = new Error('Invalid job id');
                error.statusCode = 400;
                throw error;
            }
            const job = await db.collection('jobs').findOne({ _id: new ObjectId(normalizedPayload.jobId) });
            if (!job) {
                const error = new Error('Job not found');
                error.statusCode = 404;
                throw error;
            }

            if (!ObjectId.isValid(normalizedPayload.applicantId)) {
                const error = new Error('Invalid applicant id');
                error.statusCode = 400;
                throw error;
            }
            const applicant = await db.collection('applicants').findOne({ _id: new ObjectId(normalizedPayload.applicantId) });
            if (!applicant) {
                const error = new Error('Applicant not found');
                error.statusCode = 404;
                throw error;
            }

            return await service.create(
                normalizedPayload,
                checkExists || { jobId: normalizedPayload.jobId, applicantId: normalizedPayload.applicantId }
            );
        },

        async getByApplicantId(applicantId) {
            const applications = await db.collection('applications').find({ applicantId }).toArray();
            const jobsCol = db.collection('jobs');
            const employersCol = db.collection('employers');

            return await Promise.all(
                applications.map(async (app) => {
                    const status = app.status || 'pending';
                    try {
                        if (app.jobId && ObjectId.isValid(app.jobId)) {
                            const job = await jobsCol.findOne({ _id: new ObjectId(app.jobId) });
                            if (!job) {
                                return { ...app, jobTitle: 'Deleted Job', employerName: null, jobLocation: null, status };
                            }
                            let employerName = null;
                            if (job.employerId && ObjectId.isValid(job.employerId)) {
                                const employer = await employersCol.findOne({ _id: new ObjectId(job.employerId) });
                                employerName = employer?.companyName || employer?.name || null;
                            }
                            return {
                                ...app,
                                jobTitle: job.title,
                                jobLocation: job.location ?? null,
                                employerName,
                                status,
                            };
                        }
                    } catch {
                        // fall through
                    }
                    return { ...app, jobTitle: 'Unknown Job', employerName: null, jobLocation: null, status };
                })
            );
        },
    };
}