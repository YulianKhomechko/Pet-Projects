import { Response, NextFunction } from 'express';
import {
    createUserService,
    deleteUserService,
    getUserService,
    updatePasswordService,
    updateUserService
} from '../services/usersService.js';
import { httpMessages } from '../utils/http/httpMessages.js';
import { httpStatusCodes } from '../utils/http/httpStatusCodes.js';
import { UserParams } from '../constants/Params.js';
import { UserModel } from '../models/sequelizeModels/User.js';
import { ExtendedRequest } from '../constants/ExtendedRequest.js';

// This controller is not used in application. Only in postman.
export const getUser = async (req: ExtendedRequest<UserParams>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req.params;

        const user = await getUserService(+userId);

        res.status(httpStatusCodes.statusOK).json(user);
    } catch (error) {
        next(error);
    }
};

// This controller is not used in application. Only in postman.
export const createUser = async (
    req: ExtendedRequest<{}, Partial<UserModel>>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = req.body;

        user.id = await createUserService(user);

        res.statusMessage = httpMessages.statusEntityCreate;
        res.status(httpStatusCodes.statusCreated).json(user);
    } catch (error) {
        next(error);
    }
};

// This controller is not used in application. Only in postman.
export const updateUser = async (
    req: ExtendedRequest<UserParams, UserModel>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId } = req.params;
        const user = req.body;

        await updateUserService(+userId, user);

        res.statusMessage = httpMessages.statusEntityUpdate;
        res.status(httpStatusCodes.statusOK).end();
    } catch (error) {
        next(error);
    }
};

// This controller is not used in application. Only in postman.
export const deleteUser = async (
    req: ExtendedRequest<UserParams>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId } = req.params;

        await deleteUserService(+userId);

        res.statusMessage = httpMessages.statusEntityDelete;
        res.status(httpStatusCodes.statusOK).end();
    } catch (error) {
        next(error);
    }
};

export interface UpdatePasswordBody {
    currentPassword: string;
    newPassword: string;
}

export const updatePassword = async (
    req: ExtendedRequest<UserParams, UpdatePasswordBody>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId } = req.params;
        const data = req.body;

        await updatePasswordService(+userId, data);

        res.statusMessage = httpMessages.statusEntityUpdate;
        res.status(httpStatusCodes.statusOK).end();
    } catch (error) {
        next(error);
    }
};
