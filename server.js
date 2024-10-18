import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import ruleRoutes from './routes/ruleRoutes.js';
import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
})

const mongoURI = process.env.MONGO_URI;

const app = express();

// Connect to MongoDB
connectDB(mongoURI);

// Middleware
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:4173",
        process.env.CLIENT_URL
    ],
}))
app.use(bodyParser.json());

// Routes
app.use('/api', ruleRoutes);

// Start the server
const port = 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
