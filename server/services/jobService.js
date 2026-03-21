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
        }
    }
}