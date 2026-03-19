import express from 'express';
import { MongoClient } from 'mongodb';

import applicantService from './services/applicantService.js';
import applicantController from './controllers/applicantController.js';
import applicantRoutes from './routes/applicantRoutes.js';

import applicationService from './services/applicationService.js';
import applicationController from './controllers/applicationController.js';
import applicationRoutes from './routes/applicationRoutes.js';

import ratingService from './services/ratingService.js';
import ratingController from './controllers/ratingController.js';
import ratingRoutes from './routes/ratingRoutes.js';

import jobService from './services/jobService.js';
import jobController from './controllers/jobController.js';
import jobRoutes from './routes/jobRoutes.js';

import employerService from './services/employerService.js';
import employerController from './controllers/employerController.js';
import employerRoutes from './routes/employerRoutes.js';

const app = express();

app.use(express.json());

await db();

app.listen(3000, () => console.log("Server running on port 3000"));

async function db() {
    const uri = "mongodb+srv://kadenlukeharris6_db_user:FWLwrzdaI3A1lHTm@360project.9gum5sk.mongodb.net/?appName=360Project";
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        const db = client.db("JobBoard");

        app.use("/applicants", applicantRoutes(applicantController(applicantService(db))));
        app.use("/applications", applicationRoutes(applicationController(applicationService(db))));
        app.use("/jobs", jobRoutes(jobController(jobService(db))));
        app.use("/employers", employerRoutes(employerController(employerService(db))));
        app.use("/ratings", ratingRoutes(ratingController(ratingService(db))));

        console.log("MongoDB connected!");
    }
    catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}