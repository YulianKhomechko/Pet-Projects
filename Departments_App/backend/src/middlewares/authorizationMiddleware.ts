import { NextFunction, Response } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import ServerError from '../models/Errors/ServerError.js';
import { createOrUpdateRefreshToken } from '../services/authService.js';
import { generateTokens, JWTAuthPayload } from '../utils/auth/generateTokens.js';
import { httpStatusCodes } from '../utils/http/httpStatusCodes.js';
import { unauthorizedUser } from './errorHandler.js';
import { ExtendedRequest } from '../constants/ExtendedRequest.js';

export const authorizationMiddleware = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (req.originalUrl === '/login' || req.originalUrl === '/register' || req.originalUrl === '/reset-password') {
        return next();
    }

    const { jwt: accessToken, rt: refreshToken } = req.cookies;

    try {
        const { userId, userRole, userFirstName, userLastName } = jwt.verify(
            accessToken!,
            String(process.env.JWT_SECRET)
        ) as JWTAuthPayload;
        req.user = { userId, userRole, userFirstName, userLastName };

        return next();
    } catch (error: JsonWebTokenError | unknown) {
        if ((error as JsonWebTokenError).name !== 'TokenExpiredError') {
            return next(new ServerError(httpStatusCodes.statusUnauthorized, unauthorizedUser));
        }

        try {
            const { userId, userRole, userFirstName, userLastName } = jwt.verify(
                refreshToken!,
                String(process.env.RT_SECRET)
            ) as JWTAuthPayload;
            req.user = { userId, userRole, userFirstName, userLastName };

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens({
                userId,
                userRole,
                userFirstName,
                userLastName
            });

            const cookieOptions = { httpOnly: true };
            res.cookie('jwt', newAccessToken, cookieOptions);
            res.cookie('rt', newRefreshToken, cookieOptions);

            await createOrUpdateRefreshToken({ userId, token: newRefreshToken });

            next();
        } catch (error) {
            return next(new ServerError(httpStatusCodes.statusUnauthorized, unauthorizedUser));
        }
    }
};
