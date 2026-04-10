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

            return await service.create(
                normalizedPayload,
                checkExists || { jobId: normalizedPayload.jobId, applicantId: normalizedPayload.applicantId }
            );
        },
    };
}