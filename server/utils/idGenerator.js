export async function getNextId(db, counterName) {
    const countersCollection = db.collection('counters');
    
    try {
        const result = await countersCollection.updateOne(
            { _id: counterName },
            { $inc: { seq: 1 } },
            { upsert: true }
        );
        
        const counter = await countersCollection.findOne({ _id: counterName });
        
        if (!counter || counter.seq === undefined) {
            throw new Error(`Failed to get counter for ${counterName}`);
        }
        
        return counter.seq;
    } catch (err) {
        console.error(`Error generating ID for ${counterName}:`, err);
        throw err;
    }
}
