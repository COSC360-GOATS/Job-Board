import express from 'express';
import applicationRoutes from './routes/applicationRoutes.js';

const app = express();

app.use(express.json());
app.use("/applications", applicationRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));