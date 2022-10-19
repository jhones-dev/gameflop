import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import cookieParser from 'cookie-parser';

import { morganMiddleware } from './middlewares/morgan.middleware.js';

const env = process.env.NODE_ENV || 'development';
const isDevelopment = env === 'development';
const app = express();

app.use(cors());
app.use(morganMiddleware);
app.use(cookieParser());
app.use(
  helmet({
    crossOriginEmbedderPolicy: !isDevelopment,
    contentSecurityPolicy: !isDevelopment,
  })
);

app.use(express.json());

export default app;
