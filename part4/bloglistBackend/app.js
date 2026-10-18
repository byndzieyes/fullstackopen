import config from './utils/config.js';
import express from 'express';
import mongoose from 'mongoose';
import logger from './utils/logger.js';
import blogsRouter from './controllers/blogs.js';
import usersRouter from './controllers/users.js';
import { requestLogger, unknownEndpoint, errorHandler } from './utils/middleware.js';

const app = express();

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message);
  });

app.use(express.json());
app.use(requestLogger);

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
