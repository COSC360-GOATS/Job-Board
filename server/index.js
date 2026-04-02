import express from 'express';
import { MongoClient } from 'mongodb';
import process from 'process';
import 'dotenv/config';

import cors from 'cors';
import applicantRoutes from './routes/applicantRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import employerRoutes from './routes/employerRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

await db();

app.listen(3000, () => console.log("Server running on port 3000"));

async function db() {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        const db = client.db("JobBoard");

        app.use("/applicants", applicantRoutes(db));
        app.use("/applications", applicationRoutes(db));
        app.use("/jobs", jobRoutes(db));
        app.use("/employers", employerRoutes(db));
        app.use("/ratings", ratingRoutes(db));

        console.log("MongoDB connected!");
    }
    catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}