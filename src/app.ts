import express from 'express';
import errorHandler from './api/middlewares/errorHandler';
import chatRoutes from './api/routes/chat.routes';

const app = express();

app.use(express.json());

app.use('/api/chat', chatRoutes);

app.use(errorHandler);

export default app;