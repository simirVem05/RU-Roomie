import express from 'express';
import { PORT } from './config/env.js';
import mongoose from "mongoose";
import cors from "cors";
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import matchesRouter from './routes/matches.routes.js';
import messagesRouter from './routes/messages.routes.js';
import connectToDatabase from './database/mongodb.js';

const app = express();

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/matches', matchesRouter);
app.use('/api/v1/messages', messagesRouter);

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Start the server
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);

  await connectToDatabase();
});

export default app;