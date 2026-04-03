import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import applications from './routes/applicationRoutes.js';
import applicants from './routes/applicantRoutes.js';
import jobs from './routes/jobRoutes.js';
import employers from './routes/employerRoutes.js';
import ratings from './routes/ratingRoutes.js';
import auth from './routes/authRoutes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const app = express();

app.use(cors());
app.use(express.json());
app.use("/applications", applications);
app.use("/applicants", applicants);
app.use("/jobs", jobs);
app.use("/employers", employers);
app.use("/ratings", ratings);
app.use("/auth", auth);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(3000, () => console.log("Server running on port 3000"));