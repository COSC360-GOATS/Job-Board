import { ObjectId } from 'mongodb';

export default function createService(collection) {
    return {
        async getAll() {
            return await collection.find({}).toArray();
        },

        async getById(id) {
            return await collection.findOne({ _id: new ObjectId(id) });
        },

        async create(payload) {
            const result = await collection.insertOne(payload);
            return await collection.findOne({ _id: result.insertedId });
        },

        async update(id, payload) {
            await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: payload }
            );

            return await collection.findOne({ _id: new ObjectId(id) });
        },

        async remove(id) {
            return await collection.deleteOne({ _id: new ObjectId(id) });
        }
    }
}
