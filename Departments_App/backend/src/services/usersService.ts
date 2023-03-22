import bcrypt from 'bcrypt';
import ServerError from '../models/Errors/ServerError.js';
import { user } from '../models/sequelizeModels/index.js';
import { generateRandomPassword } from '../utils/auth/generateRandomPassword.js';
import { nodemailerTransporter } from '../utils/email/transporter.js';
import { httpErrors } from '../utils/http/httpErrors.js';
import { httpStatusCodes } from '../utils/http/httpStatusCodes.js';
import { UserModel } from '../models/sequelizeModels/User.js';
import { UpdatePasswordBody } from '../controllers/usersController.js';
import { EmployeeModel } from '../models/sequelizeModels/Employee.js';

export const getUserService = async (userId: UserModel['id']): Promise<UserModel> => {
    const fetchedUser = await user.scope('find').findByPk(userId);

    if (!fetchedUser) {
        throw new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist);
    }

    return fetchedUser;
};

export const createUserService = async (data: UserModel | any): Promise<number> => {
    if (!data.password) {
        data.password = generateRandomPassword();

        await nodemailerTransporter.sendMail({
            to: data.email,
            from: 'khomechkoyulian@gmail.com',
            subject: 'Account Created',
            html: `<p>Your account has been successfully created. Your password is: <span style='font-weight: bold'>${data.password}</span>. You can change it in your user profile.</p>`
        });
    }

    data.password = await bcrypt.hash(data.password, 10);

    return (await user.create(data)).id;
};

export const updateUserService = async (
    userId: EmployeeModel['id'],
    { email, firstName, lastName }: Partial<UserModel>
): Promise<void> => {
    const userDataToUpdate = { email, firstName, lastName };

    const [affectedRows] = await user.update(userDataToUpdate, {
        where: { id: userId }
    });
    if (affectedRows === 0) {
        throw new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist);
    }
};

export const deleteUserService = async (userId: UserModel['id']): Promise<void> => {
    const affectedRows = await user.destroy({ where: { id: userId } });
    if (affectedRows === 0) {
        throw new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist);
    }
};

export const updatePasswordService = async (
    userId: UserModel['id'],
    { currentPassword, newPassword }: UpdatePasswordBody
): Promise<void> => {
    const fetchedUser = await user.findByPk(userId);

    if (!fetchedUser) {
        throw new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist);
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, fetchedUser.password);
    if (!isPasswordCorrect) {
        throw new ServerError(httpStatusCodes.statusInvalidData, httpErrors.invalidData);
    }

    await fetchedUser.update({ password: await bcrypt.hash(newPassword, 10) });
};
