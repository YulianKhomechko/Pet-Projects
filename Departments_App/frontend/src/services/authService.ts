import { api } from './axios';
import { UserCredentials } from '../models/UserCredentials';
import { RegistrationData } from '../models/RegistrationData';
import { JWTPayload } from '../models/JWTPayload';
import { User } from '../models/User';

export const loginService = async (authData: UserCredentials) => {
    return await api.post<JWTPayload>('/login', authData);
};

export const logoutService = async () => {
    return await api.post<void>('/logout');
};

export const registrationService = async (registrationData: RegistrationData) => {
    return await api.post<User>('/register', registrationData);
};

export const resetPasswordService = async (data: { email: string }) => {
    return await api.patch<void>('/reset-password', data);
};
