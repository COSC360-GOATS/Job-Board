import express from 'express';
import cors from 'cors';
import applications from './routes/applicationRoutes.js';
import applicants from './routes/applicantRoutes.js';
import jobs from './routes/jobRoutes.js';
import employers from './routes/employerRoutes.js';
import ratings from './routes/ratingRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use("/applications", applications);
app.use("/applicants", applicants);
app.use("/jobs", jobs);
app.use("/employers", employers);
app.use("/ratings", ratings);

app.listen(3000, () => console.log("Server running on port 3000"));