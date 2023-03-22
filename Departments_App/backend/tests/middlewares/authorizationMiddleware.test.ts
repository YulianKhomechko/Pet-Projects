jest.mock('jsonwebtoken');
jest.mock('../../src/utils/auth/generateTokens');
jest.mock('../../src/services/authService');

import { NextFunction, Response } from 'express';
import * as jwtModule from 'jsonwebtoken';
import Mock = jest.Mock;
import * as authServiceModule from '../../src/services/authService';
import * as generateTokensModule from '../../src/utils/auth/generateTokens';
import { authorizationMiddleware } from '../../src/middlewares/authorizationMiddleware';
import { ExtendedRequest } from '../../src/constants/ExtendedRequest';
import ServerError from '../../src/models/Errors/ServerError';
import { httpStatusCodes } from '../../src/utils/http/httpStatusCodes';
import { unauthorizedUser } from '../../src/middlewares/errorHandler';

describe('authorizationMiddleware', () => {
    let mockRequest: Partial<ExtendedRequest>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = { cookies: { rt: 'refreshToken', jwt: 'accessToken' } };
        mockResponse = {
            cookie: jest.fn()
        };

        jest.clearAllMocks();
    });

    describe('handling public routes', () => {
        it('if originalUlr is /login the NEXT function will be called', async () => {
            mockRequest = { originalUrl: '/login' };

            await authorizationMiddleware(mockRequest as ExtendedRequest, mockResponse as Response, nextFunction);

            expect(nextFunction).toBeCalled();
        });

        it('if originalUlr is /register the NEXT function will be called', async () => {
            mockRequest = { originalUrl: '/register' };

            await authorizationMiddleware(mockRequest as ExtendedRequest, mockResponse as Response, nextFunction);

            expect(nextFunction).toBeCalled();
        });

        it('if originalUlr is /reset-password the NEXT function will be called', async () => {
            mockRequest = { originalUrl: '/reset-password' };

            await authorizationMiddleware(mockRequest as ExtendedRequest, mockResponse as Response, nextFunction);

            expect(nextFunction).toBeCalled();
        });
    });

    describe('successful jwt validation', () => {
        it('will set user property on request object if jwt validation was successful, and it will call NEXT function after user was set.', async () => {
            const expectedJWTVerifyReturnValue = {
                userId: 'testUserId',
                userRole: 'testUserRole',
                userFirstName: 'testUserFirstName',
                userLastName: 'testUserLastName'
            };

            (jwtModule.verify as Mock).mockReturnValueOnce(expectedJWTVerifyReturnValue);

            await authorizationMiddleware(mockRequest as ExtendedRequest, mockResponse as Response, nextFunction);

            expect(mockRequest.user).toEqual(expectedJWTVerifyReturnValue);
            expect(nextFunction).toBeCalled();
        });
    });

    describe('failed jwt validation', () => {
        it('will throw a specific ServerError if jwt validation was not successful and error is not "TokenExpiredError"', async () => {
            (jwtModule.verify as Mock).mockImplementationOnce(() => {
                throw { name: 'notTokenExpiredError' };
            });

            await authorizationMiddleware(mockRequest as ExtendedRequest, mockResponse as Response, nextFunction);

            expect(nextFunction).toBeCalledWith(new ServerError(httpStatusCodes.statusUnauthorized, unauthorizedUser));
        });

        it('will check refresh token if access token is expires (handling TokenExpiredError)', async () => {
            const expectedJWTVerifyReturnValue = {
                userId: 'testUserId',
                userRole: 'testUserRole',
                userFirstName: 'testUserFirstName',
                userLastName: 'testUserLastName'
            };

            (jwtModule.verify as Mock).mockImplementation((token: string): {} | void => {
                if (token === 'accessToken') {
                    throw { name: 'TokenExpiredError' };
                }

                if (token === 'refreshToken') {
                    return expectedJWTVerifyReturnValue;
                }
            });

            // testing .verify() method mock
            expect(() => (jwtModule.verify as Mock)('accessToken')).toThrow(); // it should throw an error if 'accessToken' was provided as an argument.
            const jwtResult = (jwtModule.verify as Mock)('refreshToken');
            expect(jwtResult).toEqual(expectedJWTVerifyReturnValue); // it should return a certain object if 'refreshToken' was provided as an argument.

            (generateTokensModule.generateTokens as any) = jest.fn((obj: any) => ({
                accessToken: 'newAccessToken',
                refreshToken: 'newRefreshToken'
            }));

            await authorizationMiddleware(mockRequest as ExtendedRequest, mockResponse as Response, nextFunction);

            // it should set user property on request object
            expect(mockRequest.user).toEqual(expectedJWTVerifyReturnValue);

            // it should call generateTokens function and pass user object into it.
            expect(generateTokensModule.generateTokens).toBeCalledWith(expectedJWTVerifyReturnValue);

            // it should write new refresh token to the database (createOrUpdateRefreshToken function should be called)
            expect(authServiceModule.createOrUpdateRefreshToken).toBeCalled();

            // next function should be called
            expect(nextFunction).toBeCalled();
        });
    });
});
