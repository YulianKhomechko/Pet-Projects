import { createAsyncThunk } from '@reduxjs/toolkit';
import { modalSuccess } from '../constants/modalTypes';
import { changePasswordService, getUserService } from '../services/usersService';
import { showModal } from '../store/modalSlice';
import { UpdatePassword } from '../models/UpdatePassword';

export const fetchUser = createAsyncThunk('users/fetchUser', async (userId: number) => {
    return await getUserService(userId);
});

export const changePasswordThunk = createAsyncThunk(
    'users/changePassword',
    async ({ userId, data }: { userId: number; data: UpdatePassword }, { dispatch }) => {
        const { statusText } = await changePasswordService(userId, data);
        dispatch(showModal({ type: modalSuccess, text: statusText }));
    }
);
