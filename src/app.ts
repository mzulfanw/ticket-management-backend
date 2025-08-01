import express from 'express';
import cors from 'cors';
import router from './routes';
import { errorHandler } from './middleware/errorhandler';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/v1', router);
app.use(errorHandler)

export default app;
