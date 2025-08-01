import express from 'express';
import cors from 'cors';
import router from './routes';
import { errorHandler } from './middleware/errorhandler';
import { logger } from './middleware/logger';
import { env } from './constants/env';

const app = express();
// CORS
app.use(cors());
// JSON
app.use(express.json());
// LOGGER MORGAN
app.use(logger(env.NODE_ENV))
// ROUTES
app.use('/api/v1', router);
// ERROR HANDLER
app.use(errorHandler)

export default app;
