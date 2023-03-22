import { api } from './axios';
import { UpdatePassword } from '../models/UpdatePassword';
import { User } from '../models/User';

export const getUserService = async (userId: number) => {
    return await api.get<User>(`/users/${userId}`);
};

export const changePasswordService = async (userId: number, data: UpdatePassword) => {
    return await api.patch<void>(`/users/${userId}/password`, data);
};
