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
            };

            return await service.create(normalizedPayload, checkExists);
        },

        async getByApplicantId(applicantId) {
            const applications = await db.collection('applications').find({ applicantId }).toArray();
            
            return await Promise.all(
                applications.map(async (app) => {
                    try {
                        if (app.jobId) {
                            const { ObjectId } = await import('mongodb');
                            const job = await db.collection('jobs').findOne({ _id: new ObjectId(app.jobId) });
                            return { ...app, jobTitle: job ? job.title : 'Deleted Job' };
                        }
                    } catch(e) {}
                    return { ...app, jobTitle: 'Unknown Job' };
                })
            );
        },
    };
}