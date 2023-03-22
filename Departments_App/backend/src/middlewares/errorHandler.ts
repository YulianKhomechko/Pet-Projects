import { Request, Response } from 'express';
import criticalErrorEmitter from '../models/Errors/CriticalErrorEmitter.js';
import { httpErrors } from '../utils/http/httpErrors.js';
import { httpStatusCodes } from '../utils/http/httpStatusCodes.js';

export const criticalErrorEvent = 'critical error';
const validationError = 'SequelizeValidationError';
const constraintError = 'SequelizeUniqueConstraintError';
const sequelizeForeignKeyConstraint = 'SequelizeForeignKeyConstraintError';
export const unauthorizedUser = 'unauthorizedUser';

class jsonError {
    error: {
        name?: string;
        message: string;
    };

    constructor(message: string, name?: string) {
        this.error = {
            name,
            message
        };
    }
}

export const globalErrorHandler = (err: any, req: Request, res: Response): void => {
    if (err.statusCode === httpStatusCodes.statusUnauthorized) {
        res.status(httpStatusCodes.statusUnauthorized).json(new jsonError(httpErrors.unauthorized, unauthorizedUser));
        return;
    }

    if (err.name === validationError) {
        res.status(httpStatusCodes.statusInvalidData).json(new jsonError(httpErrors.invalidData));
        return;
    }
    if (err.name === constraintError) {
        res.status(httpStatusCodes.statusInvalidData).json(new jsonError(err.errors[0].message));
        return;
    }

    if (err.name === sequelizeForeignKeyConstraint) {
        res.status(httpStatusCodes.statusClientError).json(
            new jsonError(httpErrors.containsChildren, sequelizeForeignKeyConstraint)
        );
        return;
    }

    // Set generic status code and status message
    if (!err.statusCode) {
        err.statusCode = httpStatusCodes.statusServerError;
    }
    if (!err.message && String(err.statusCode).startsWith('4')) {
        err.message = httpErrors.clientError;
    }
    if (!err.message && String(err.statusCode).startsWith('5')) {
        err.message = httpErrors.serverError;
    }

    // Emmit critical error event
    if (String(err.statusCode).startsWith('5')) {
        criticalErrorEmitter.emit(criticalErrorEvent, err);
    }

    res.status(err.statusCode).json(new jsonError(err.message));
};
