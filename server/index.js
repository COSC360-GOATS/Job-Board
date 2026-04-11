import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import process from 'process';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import applicantRoutes from './routes/applicantRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import employerRoutes from './routes/employerRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import savedJobsRoutes from './routes/savedJobsRoutes.js';
import createSseHub from './realtime/sseHub.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const sseHub = createSseHub();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/upload', uploadRoutes());
app.get('/events', sseHub.handler);

await db();

app.listen(3000, () => console.log("Server running on port 3000"));

async function db() {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db("JobBoard");

        app.use("/applicants", applicantRoutes(database));
        app.use("/applications", applicationRoutes(database, sseHub.emit));
        app.use("/jobs", jobRoutes(database, sseHub.emit));
        app.use("/employers", employerRoutes(database));
        app.use("/ratings", ratingRoutes(database, sseHub.emit));
        app.use("/auth", authRoutes(database));
        app.use("/saved", savedJobsRoutes(database));
        console.log("MongoDB connected!");
    }
    catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}
