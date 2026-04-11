import { ObjectId } from "mongodb";

const COLLECTION = "savedJobs";

export default function savedJobsService(db) {
    const collection = db.collection(COLLECTION);
    const jobsCol = db.collection("jobs");
    const applicantsCol = db.collection("applicants");

    collection
        .createIndex({ applicantId: 1, jobId: 1 }, { unique: true })
        .catch(() => {});

    return {
        async save({ applicantId, jobId }) {
            if (!ObjectId.isValid(applicantId) || !ObjectId.isValid(jobId)) {
                const err = new Error("Invalid id");
                err.statusCode = 400;
                throw err;
            }

            const [applicant, job] = await Promise.all([
                applicantsCol.findOne({ _id: new ObjectId(applicantId) }),
                jobsCol.findOne({ _id: new ObjectId(jobId) }),
            ]);

            if (!applicant) {
                const err = new Error("Applicant not found");
                err.statusCode = 404;
                throw err;
            }
            if (!job) {
                const err = new Error("Job not found");
                err.statusCode = 404;
                throw err;
            }

            const savedAt = new Date().toISOString();
            try {
                await collection.insertOne({
                    applicantId,
                    jobId,
                    savedAt,
                });
            } catch (e) {
                if (e?.code === 11000) {
                    return await collection.findOne({ applicantId, jobId });
                }
                throw e;
            }

            return await collection.findOne({ applicantId, jobId });
        },

        async listJobsForUser(applicantId) {
            if (!ObjectId.isValid(applicantId)) return [];

            const applicant = await applicantsCol.findOne({ _id: new ObjectId(applicantId) });
            if (!applicant) {
                const err = new Error("Applicant not found");
                err.statusCode = 404;
                throw err;
            }

            const saved = await collection
                .find({ applicantId })
                .sort({ savedAt: -1 })
                .toArray();

            const orderedIds = saved.map((s) => s.jobId).filter((id) => ObjectId.isValid(id));
            if (orderedIds.length === 0) return [];

            const jobs = await jobsCol
                .find({
                    _id: { $in: orderedIds.map((id) => new ObjectId(id)) },
                })
                .toArray();

            const rank = new Map(orderedIds.map((id, i) => [String(id), i]));
            jobs.sort((a, b) => (rank.get(String(a._id)) ?? 0) - (rank.get(String(b._id)) ?? 0));

            return jobs;
        },

        async listJobIdsForUser(applicantId) {
            if (!ObjectId.isValid(applicantId)) return [];
            const rows = await collection.find({ applicantId }).project({ jobId: 1, _id: 0 }).toArray();
            return rows.map((r) => r.jobId).filter(Boolean);
        },

        async remove({ applicantId, jobId }) {
            if (!ObjectId.isValid(applicantId) || !ObjectId.isValid(jobId)) {
                const err = new Error("Invalid id");
                err.statusCode = 400;
                throw err;
            }

            const result = await collection.deleteOne({ applicantId, jobId });
            return { deleted: result.deletedCount > 0 };
        },
    };
}
