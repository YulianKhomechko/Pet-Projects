import jwt, { SignOptions } from 'jsonwebtoken';
import { userRoles } from '../../constants/userRoles.js';

export interface JWTAuthPayload {
    userId: number;
    userRole: userRoles;
    userFirstName: string;
    userLastName: string;
}

export const generateTokens = (
    payload: JWTAuthPayload,
    accessTokenOptions?: SignOptions,
    refreshTokenOptions?: SignOptions
) => {
    const accessTokenDefaultOptions = { expiresIn: process.env.JWT_EXPIRES_IN };
    const refreshTokenDefaultOptions = { expiresIn: process.env.RT_EXPIRES_IN };

    return {
        accessToken: jwt.sign(
            payload,
            String(process.env.JWT_SECRET),
            Object.assign(accessTokenDefaultOptions, accessTokenOptions)
        ),
        refreshToken: jwt.sign(
            payload,
            String(process.env.RT_SECRET),
            Object.assign(refreshTokenDefaultOptions, refreshTokenOptions)
        )
    };
};
