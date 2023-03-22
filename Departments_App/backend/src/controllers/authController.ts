import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
    authenticationService,
    createOrUpdateRefreshToken,
    deleteRefreshToken,
    registrationService,
    resetPasswordService
} from '../services/authService.js';
import { generateTokens, JWTAuthPayload } from '../utils/auth/generateTokens.js';
import { httpMessages } from '../utils/http/httpMessages.js';
import { httpStatusCodes } from '../utils/http/httpStatusCodes.js';
import { RegisterUserModel, UserModel } from '../models/sequelizeModels/User.js';
import { ExtendedRequest } from '../constants/ExtendedRequest.js';

type LoginBody = Pick<UserModel, 'email' | 'password'>;

export const login = async (req: ExtendedRequest<{}, LoginBody>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;
        const {
            id: userId,
            role: userRole,
            firstName: userFirstName,
            lastName: userLastName
        } = await authenticationService({ email, password });

        const payload = {
            userId,
            userRole,
            userFirstName,
            userLastName
        } as JWTAuthPayload;
        const { accessToken, refreshToken } = generateTokens(payload);

        // send cookies with tokens
        const cookieOptions = { httpOnly: true };
        res.cookie('jwt', accessToken, cookieOptions);
        res.cookie('rt', refreshToken, cookieOptions);

        await createOrUpdateRefreshToken({ userId, token: refreshToken });

        res.statusMessage = httpMessages.messageLoggedIn;
        res.json({ userId, userRole, userFirstName, userLastName });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        await deleteRefreshToken({ token: req.cookies.rt! });

        res.clearCookie('jwt');
        res.clearCookie('rt');

        res.statusMessage = httpMessages.messageLoggedOut;
        res.status(httpStatusCodes.statusOK).end();
    } catch (error) {
        next(error);
    }
};

export const register = async (
    req: ExtendedRequest<{}, RegisterUserModel>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const data = req.body;

        const user = await registrationService(data);

        res.statusMessage = httpMessages.statusEntityCreate;
        res.status(httpStatusCodes.statusCreated).json(user);
    } catch (error) {
        next(error);
    }
};

type ResetPasswordBody = Pick<UserModel, 'email'>;

export const resetPassword = async (
    req: ExtendedRequest<{}, ResetPasswordBody>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email } = req.body;

        await resetPasswordService(email);

        res.statusMessage = httpMessages.statusEntityUpdate;
        res.status(httpStatusCodes.statusOK).end();
    } catch (error) {
        next(error);
    }
};
