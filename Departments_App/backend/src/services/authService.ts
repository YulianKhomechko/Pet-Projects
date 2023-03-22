import bcrypt from 'bcrypt';
import ServerError from '../models/Errors/ServerError.js';
import { refreshTokenModel } from '../models/sequelizeModels/index.js';
import { user, UserModel } from '../models/sequelizeModels/User.js';
import { generateRandomPassword } from '../utils/auth/generateRandomPassword.js';
import { nodemailerTransporter } from '../utils/email/transporter.js';
import { httpErrors } from '../utils/http/httpErrors.js';
import { httpStatusCodes } from '../utils/http/httpStatusCodes.js';
import { RefreshTokenCreateModel } from '../models/sequelizeModels/RefreshToken.js';

type AuthOutput = Pick<UserModel, 'id' | 'role' | 'firstName' | 'lastName'>;

type AuthInput = Pick<UserModel, 'email' | 'password'>;

export const authenticationService = async ({ email, password }: AuthInput): Promise<AuthOutput> => {
    const fetchedUser = await user.findOne({ where: { email: email } });

    if (fetchedUser === null) {
        throw new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist);
    }

    const isPasswordCorrect = await bcrypt.compare(password, fetchedUser.password);

    if (!isPasswordCorrect) {
        throw new ServerError(httpStatusCodes.statusUnauthorized, httpErrors.invalidData);
    }

    return {
        id: fetchedUser.id,
        role: fetchedUser.role,
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName
    };
};

type RegistrationOutput = Pick<UserModel, 'id' | 'role' | 'firstName' | 'lastName' | 'email'>;

export const registrationService = async (data: UserModel | any): Promise<RegistrationOutput> => {
    data.password = await bcrypt.hash(data.password, 10);

    const fetchedUser = await user.create(data);
    return {
        id: fetchedUser.id,
        role: fetchedUser.role,
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName,
        email: fetchedUser.email
    };
};

export const createOrUpdateRefreshToken = async ({ userId, token }: RefreshTokenCreateModel): Promise<void> => {
    const fetchedToken = await refreshTokenModel.findOne({ where: { userId } });
    if (!fetchedToken) {
        await refreshTokenModel.create({ token, userId });
        return;
    }

    await fetchedToken.update({ token });
};

export const deleteRefreshToken = async ({ token }: Omit<RefreshTokenCreateModel, 'userId'>): Promise<void> => {
    const affectedRows = await refreshTokenModel.destroy({
        where: { token: token }
    });
    if (affectedRows === 0) {
        throw new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist);
    }
};

export const resetPasswordService = async (email: UserModel['email']): Promise<void> => {
    const fetchedUser = await user.findOne({ where: { email } });
    if (!fetchedUser) {
        throw new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist);
    }

    const newPassword = generateRandomPassword();
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    await nodemailerTransporter.sendMail({
        to: email,
        from: 'khomechkoyulian@gmail.com',
        subject: 'reset password',
        html: `<p>You successfully reset your password. Your new password is: ${newPassword}</p>`
    });

    await fetchedUser.update({ password: newHashedPassword });
};
