import createService from './service.js';

export default function applicantService(db) {
    const baseService = createService(db.collection('applicants'));
    const collection = db.collection('applicants');

    return {
        ...baseService,

        async create(payload) {
            return await baseService.create(payload, { email: payload.email });
        }
    };
}