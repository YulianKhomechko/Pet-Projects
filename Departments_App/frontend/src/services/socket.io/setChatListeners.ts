import { type ThunkDispatch } from '@reduxjs/toolkit';
import { type NavigateFunction } from 'react-router-dom';
import {
    CHAT_CREATED,
    CHAT_INITIALIZED,
    CHAT_JOIN,
    MESSAGE_CREATED,
    MESSAGE_RETRIEVED
} from '../../constants/socket.io';
import { addChat, addMessage, addUnreadMessage, setChats, setMessages } from '../../store/chatsSlice';
import { showModal } from '../../store/modalSlice';
import { modalInfo } from '../../constants/modalTypes';

export const setChatSocketListeners = (
    socket: any,
    dispatch: ThunkDispatch<any, any, any>,
    navigate: NavigateFunction,
    userId: number
) => {
    socket.on(CHAT_INITIALIZED, (chats: any[]) => {
        dispatch(setChats(chats));
    });

    socket.on(CHAT_CREATED, (chat: any) => {
        if (chat.chatId) {
            return navigate(`/chat/${chat.chatId}`);
        }

        if (+chat.receiverUserId === +userId || +chat.userId === +userId) {
            dispatch(addChat(chat));
            socket.emit(CHAT_JOIN, chat.id);
        }
        if (+chat.userId === +userId) {
            navigate(`/chat/${chat.id}`);
        }
    });

    socket.on(MESSAGE_RETRIEVED, (messages: any[]) => {
        dispatch(setMessages(messages));
    });

    socket.on(MESSAGE_CREATED, (message: any) => {
        // eslint-disable-next-line no-restricted-globals
        if (!location.pathname.startsWith('/chat') || !location.pathname.endsWith(message.chatId)) {
            dispatch(showModal({ type: modalInfo, text: 'New message received.' }));
            dispatch(addUnreadMessage(message));
        }

        dispatch(addMessage(message));
    });
};
