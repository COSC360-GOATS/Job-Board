import express from 'express';
import applications from './routes/applicationRoutes.js';
import applicants from './routes/applicantRoutes.js';
import jobs from './routes/jobRoutes.js';
import employers from './routes/employerRoutes.js';

const app = express();

app.use(express.json());
app.use("/applications", applications);
app.use("/applicants", applicants);
app.use("/jobs", jobs);
app.use("/employers", employers);

app.listen(3000, () => console.log("Server running on port 3000"));