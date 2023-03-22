import { NextFunction, Response } from 'express';
import ServerError from '../models/Errors/ServerError.js';
import { httpErrors } from '../utils/http/httpErrors.js';
import { httpStatusCodes } from '../utils/http/httpStatusCodes.js';
import { userRoles } from '../constants/userRoles.js';
import { ExtendedRequest } from '../constants/ExtendedRequest.js';
import { UserParams } from '../constants/Params.js';

export const allowToSameUser = (req: ExtendedRequest<UserParams>, res: Response, next: NextFunction) => {
    const user = req.user;
    const { userId, userRole } = user!;
    const { userId: paramsUserId } = req.params;

    if (+paramsUserId !== +userId && userRole !== userRoles.admin) {
        return next(new ServerError(httpStatusCodes.statusForbidden, httpErrors.notAllowed));
    }

    next();
};
