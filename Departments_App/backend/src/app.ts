import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import devErrorHandler from 'errorhandler';
import express, { Application } from 'express';
import morgan from 'morgan';
import { authorizationMiddleware } from './middlewares/authorizationMiddleware.js';
import { criticalErrorEvent, globalErrorHandler } from './middlewares/errorHandler.js';
import { logError, logInfo } from './middlewares/loggers.js';
import criticalErrorEmitter from './models/Errors/CriticalErrorEmitter.js';
import rootRouter from './routers/index.js';
import { createError } from './services/errorService.js';

const app: Application = express();

criticalErrorEmitter.on(criticalErrorEvent, async (error) => {
    await createError(error);
});

// Middlewares
app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: process.env.ORIGIN
    })
);
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(morgan('dev'));
// log successful requests
app.use(logInfo);
// log errors
app.use(logError);

// auth middleware
app.use(authorizationMiddleware);

// Router
app.use('/', rootRouter);

// Error Handler
if (process.env.NODE_ENV === 'development') {
    app.use(devErrorHandler());
}

if (process.env.NODE_ENV === 'production') {
    app.use(globalErrorHandler);
}

export default app;
