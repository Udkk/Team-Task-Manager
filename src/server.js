import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import app from './app.js';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

const PORT = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const clientDistPath = path.join(rootDir, 'client', 'dist');
const clientIndexPath = path.join(clientDistPath, 'index.html');
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  // In production, Express serves the Vite React build from the same Railway service.
  app.use(express.static(clientDistPath));

  // Unknown non-API GET requests fall back to React so client-side routing works.
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }

    return res.sendFile(clientIndexPath);
  });
}

// API requests that were not matched above should still return JSON 404/errors.
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
