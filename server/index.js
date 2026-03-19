import express from 'express';
import applications from './routes/applicationRoutes.js';
import applicants from './routes/applicantRoutes.js';
import jobs from './routes/jobRoutes.js';
import employers from './routes/employerRoutes.js';
import ratings from './routes/ratingRoutes.js';
import { MongoClient } from 'mongodb';

const app = express();

app.use(express.json());
app.use("/applications", applications);
app.use("/applicants", applicants);
app.use("/jobs", jobs);
app.use("/employers", employers);
app.use("/ratings", ratings);

await db();

app.listen(3000, () => console.log("Server running on port 3000"));

async function db() {
    const uri = "mongodb+srv://kadenlukeharris6_db_user:6eTaocWBeJ0lpzcM@360project.9gum5sk.mongodb.net/?appName=360Project";

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const databases = await client.db("admin").admin().listDatabases();
        console.log("Databases:", databases.databases.map(d => d.name));
    }
    catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
    finally {
        client.close();
    }
}