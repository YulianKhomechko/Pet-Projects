import { NextFunction, Response } from 'express';
import ServerError from '../models/Errors/ServerError.js';
import { httpErrors } from '../utils/http/httpErrors.js';
import { httpStatusCodes } from '../utils/http/httpStatusCodes.js';
import { userRoles } from '../constants/userRoles.js';
import { ExtendedRequest } from '../constants/ExtendedRequest.js';
import { ParamsDictionary, Query } from 'express-serve-static-core';

/**
 * This function accepts array of allowed user roles and returns middleware which restricts certain users from accessing the route. <br />
 * admin has access to all routes by default.
 * @param {Array.<string>} allowedRoles
 * @returns {(function(*, *, *): (*|undefined))|*}
 */

export const protectRoute = <P extends ParamsDictionary = {}, ReqBody = null, ReqQuery extends Query = {}>(
    allowedRoles: (string | userRoles)[]
): ((req: ExtendedRequest<P, ReqBody, ReqQuery>, res: Response, next: NextFunction) => void) => {
    if (!Array.isArray(allowedRoles)) {
        throw new Error('You should pass an array as a parameter.');
    }

    return (req: ExtendedRequest<P, ReqBody, ReqQuery>, res: Response, next: NextFunction) => {
        const userRole = req.user!.userRole;

        if (!allowedRoles.includes(userRoles.admin)) {
            allowedRoles.push(userRoles.admin);
        }

        if (!allowedRoles.includes(userRole)) {
            return next(new ServerError(httpStatusCodes.statusForbidden, httpErrors.notAllowed));
        }

        next();
    };
};
