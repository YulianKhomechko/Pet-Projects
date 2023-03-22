import { Router } from 'express';
import departmentsRouter from './departmentsRouter.js';
import employeesRouter from './employeesRouter.js';
import usersRouter from './usersRouter.js';
import authRouter from './authRouter.js';
import chatRouter from './chatRouter.js';

const rootRouter = Router();

rootRouter.use('/departments', departmentsRouter);
rootRouter.use('/departments', employeesRouter);
rootRouter.use('/users', usersRouter);
rootRouter.use('/chat', chatRouter);

rootRouter.use('/', authRouter);

export default rootRouter;
