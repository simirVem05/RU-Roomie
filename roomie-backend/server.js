import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT } from './config/env.js';
import connectToDatabase from './database/mongodb.js';

import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import matchesRouter from './routes/matches.routes.js';
import messagesRouter from './routes/messages.routes.js';
import errorMiddleware from './middleware/error.middleware.js';
import profileRoutes from "./routes/profile.routes.js";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use("/api/v1/profile", profileRoutes);
app.use('/api/v1/matches', matchesRouter);
app.use('/api/v1/messages', messagesRouter);


app.get('/', (req, res) => res.send('API is running'));


app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
