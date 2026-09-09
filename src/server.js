
import dotenv from 'dotenv';

import app from './app.js';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

const PORT = process.env.PORT || 8080;

// API requests that were not matched should return JSON 404/errors.
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

