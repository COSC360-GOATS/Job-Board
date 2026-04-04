import createService from "./service.js";

export default function employerService(db) {
    const baseService = createService(db.collection('employers'));
    const collection = db.collection('employers');

    return {
        ...baseService,

        async create(payload) {
            return await baseService.create(payload, { email: payload.email });
        },

        async update(id, payload) {
            return await baseService.update(id, payload);
        },

        async getByUsername(username) {
            return await collection.findOne({ username });
        },

        async getByEmail(email) {
            return await collection.findOne({ email });
        }
    };
}