import createService from './service.js';

export default function applicantService(db) {
    const baseService = createService(db.collection('applicants'));
    const collection = db.collection('applicants');

    return {
        ...baseService,
        async create(payload) {
            const existingApplicant = await collection.findOne({ email: payload.email });
            if (existingApplicant) {
                const error = new Error('Email already exists');
                error.statusCode = 409;
                throw error;
            }

            const result = await collection.insertOne(payload);
            return await collection.findOne({ _id: result.insertedId });
        }
    };
}