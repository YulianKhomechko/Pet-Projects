import { createAsyncThunk } from '@reduxjs/toolkit';
import { CHAT_INITIALIZE } from '../constants/socket.io';
import { socket } from '../services/socket.io';
import { NavigateFunction } from 'react-router-dom';
import { setChatSocketListeners } from '../services/socket.io/setChatListeners';

export const chatThunk = createAsyncThunk(
    'chat/chatThunk',
    async ({ navigate, userId }: { navigate: NavigateFunction; userId: number }, { dispatch }) => {
        socket.emit(CHAT_INITIALIZE, userId);

        setChatSocketListeners(socket, dispatch, navigate, userId);
    }
);
