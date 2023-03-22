jest.mock('../../src/models/sequelizeModels/Employee.js', () => ({
    belongsTo: () => undefined
}));
jest.mock('../../src/models/sequelizeModels/RefreshToken.js', () => ({
    belongsTo: () => undefined
}));
jest.mock('../../src/models/sequelizeModels/Chat.js', () => ({
    belongsTo: () => undefined
}));

import * as bcryptModule from 'bcrypt';
import * as nodemailerTransporterModule from '../../src/utils/email/transporter';
import * as userModule from '../../src/models/sequelizeModels/User.js';
import * as generateRandomPasswordModule from '../../src/utils/auth/generateRandomPassword';
import { userRoles } from '../../src/constants/userRoles';
import { httpStatusCodes } from '../../src/utils/http/httpStatusCodes';
import {
    createUserService,
    deleteUserService,
    getUserService,
    updatePasswordService,
    updateUserService
} from '../../src/services/usersService';
import ServerError from '../../src/models/Errors/ServerError';
import { httpErrors } from '../../src/utils/http/httpErrors';

describe('usersService', () => {
    describe('getUserService', () => {
        const testUserId = 1;
        it('should retrieve the user with provided userId from the database', async () => {
            (userModule as any).findByPk = jest.fn(async () => ({ id: testUserId }));

            const result = await getUserService(testUserId);

            expect(result.id).toBe(testUserId);
        });

        it('throws a corresponding descriptive error if user does not exist', () => {
            (userModule as any).create = jest.fn(async () => undefined);

            getUserService(testUserId).catch((error) => {
                expect(error).toBeInstanceOf(ServerError);
                expect(error).toEqual(new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist));
            });
        });
    });

    describe('createUserService', () => {
        const mockUserData = {
            firstName: 'testFirstName',
            lastName: 'testLastName',
            email: 'test@mail.com',
            role: userRoles.user
        };
        const testReturnId = 1;

        (userModule as any).user.create = jest.fn(async () => ({
            id: testReturnId
        }));

        it('should return id of created user', async () => {
            const result = await createUserService({ ...mockUserData, password: 'testPassword' });

            expect(result).toBe(testReturnId);
        });

        it('if a password was not provided it generates a random password and calls .sendMail() method', async () => {
            const spyGenerateRandomPassword = jest.spyOn(generateRandomPasswordModule, 'generateRandomPassword');

            (nodemailerTransporterModule as any).nodemailerTransporter.sendMail = jest.fn();

            await createUserService(mockUserData);

            expect(spyGenerateRandomPassword).toBeCalled();
            expect(nodemailerTransporterModule.nodemailerTransporter.sendMail).toBeCalled();
        });
    });

    describe('updateUserService', () => {
        it('throws a corresponding descriptive error if user was not found (affectedRows === 0)', async () => {
            const testUserId = 1;
            const testUserData = { email: 'test@mail.com', firstName: 'testFirstName', lastName: 'testLastName' };

            (userModule as any).user.update = jest.fn(async () => [0]);

            updateUserService(testUserId, testUserData).catch((error) => {
                expect(error).toEqual(new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist));
            });
        });
    });

    describe('deleteUserService', () => {
        it('throws a corresponding descriptive error if user was not found (affectedRows === 0)', async () => {
            const testUserId = 1;

            (userModule as any).user.destroy = jest.fn(async () => [0]);

            deleteUserService(testUserId).catch((error) => {
                expect(error).toEqual(new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist));
            });
        });
    });

    describe('updatePasswordService', () => {
        const testUserId = 1;
        const testData = { currentPassword: 'testCurrentPassword', newPassword: 'testNewPassword' };

        it('throws a corresponding descriptive error if user was not found', async () => {
            (userModule as any).user.findByPk = jest.fn(async () => undefined);

            updatePasswordService(testUserId, testData).catch((error) => {
                expect(error).toEqual(new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist));
            });
        });

        it('throws a corresponding descriptive error if provided current password is not correct', async () => {
            (userModule as any).user.findByPk = jest.fn(async () => true); // simulate that user was found
            (userModule as any).user.update = jest.fn(async () => undefined);
            (bcryptModule as any).default.compare = jest.fn(async () => false); // simulate that password is wrong

            updatePasswordService(testUserId, testData).catch((error) => {
                expect(error).toEqual(new ServerError(httpStatusCodes.statusInvalidData, httpErrors.invalidData));
            });
        });
    });
});
