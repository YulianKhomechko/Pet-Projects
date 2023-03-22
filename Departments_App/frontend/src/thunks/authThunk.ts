import { createAsyncThunk } from '@reduxjs/toolkit';
import { modalCreateSuccess, modalSuccess } from '../constants/modalTypes';
import { CHAT_LEAVE_ALL_ROOMS } from '../constants/socket.io';
import { loginService, logoutService, registrationService, resetPasswordService } from '../services/authService';
import { socket } from '../services/socket.io';
import { showModal } from '../store/modalSlice';
import { UserCredentials } from '../models/UserCredentials';
import { RegistrationData } from '../models/RegistrationData';

export const loginThunk = createAsyncThunk('auth/login', async (credentials: UserCredentials, { dispatch }) => {
    const { data, statusText } = await loginService(credentials);
    dispatch(showModal({ type: modalSuccess, text: statusText }));

    return data;
});

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
    socket.emit(CHAT_LEAVE_ALL_ROOMS);
    socket.removeAllListeners();

    await logoutService();
});

export const registrationThunk = createAsyncThunk('auth/registration', async (data: RegistrationData, { dispatch }) => {
    const { statusText } = await registrationService(data);
    dispatch(showModal({ type: modalCreateSuccess, text: statusText }));
});

export const resetPasswordThunk = createAsyncThunk(
    'auth/restorePassword',
    async (data: { email: string }, { dispatch }) => {
        const { statusText } = await resetPasswordService(data);
        dispatch(showModal({ type: modalSuccess, text: statusText }));
    }
);
