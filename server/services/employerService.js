import bcrypt from 'bcryptjs';
import createService from "./service.js";

export default function employerService(db) {
    const baseService = createService(db.collection('employers'));
    const collection = db.collection('employers');
    
    return {
        ...baseService,
        
        async create(payload) {
            const existingEmployer = await collection.findOne({ email: payload.email });
            if (existingEmployer) {
                const error = new Error('Email already exists');
                error.statusCode = 409;
                throw error;
            }

            if (payload.password) {
                const saltRounds = 10;
                payload.password = await bcrypt.hash(payload.password, saltRounds);
            }
            
            return await baseService.create(payload);
        },
        
        async update(id, payload) {
            if (payload.password) {
                const saltRounds = 10;
                payload.password = await bcrypt.hash(payload.password, saltRounds);
            }
            
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