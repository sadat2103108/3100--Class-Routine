import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import settingsRoutes from './routes/settings.routes.js';
import routineRoutes from './routes/routine.routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

app.use('/api/settings', settingsRoutes);
app.use('/api/routine', routineRoutes);

const PORT = process.env.SERVER_PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;



mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    app.listen(PORT, () => {
        console.log('MongoDB connected');
        console.log(`Server running on ${process.env.BASE_URL + ':' + PORT}`);
    });
})
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
