import express from 'express';
import cors from "cors";
import routes from './routes';
import errorHandler from './middleware/errorHandler';

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(",") || [],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api', routes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "API running" });
});

// Error handling middleware
app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use(errorHandler);

export default app;