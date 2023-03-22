import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { Chat } from '../models/Chat';
import { ChatMessage } from '../models/ChatMessage';
import { ResponseError } from '../models/ResponseError';

interface chatsState {
    chats: Chat[];
    messages: ChatMessage[];
    unreadMessages: ChatMessage[];
    status: string | null;
    error: ResponseError | null;
}

const initialState: chatsState = {
    chats: [],
    messages: [],
    unreadMessages: [],
    status: null,
    error: null
};

const chatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setChats: (state, { payload }) => {
            state.chats = payload;
        },
        addChat: (state, { payload }) => {
            state.chats.push(payload);
        },
        setMessages: (state, { payload }) => {
            state.messages = payload;
        },
        addMessage: (state, { payload }) => {
            state.messages.push(payload);
        },
        addUnreadMessage: (state, { payload }) => {
            state.unreadMessages.push(payload);
        },
        clearUnreadMessages: (state, { payload }) => {
            state.unreadMessages = state.unreadMessages.filter((message) => +message.chatId !== +payload);
        }
    }
});

export const selectChats = (state: RootState) => state.chats;

export const { setChats, addChat, setMessages, addMessage, addUnreadMessage, clearUnreadMessages } = chatsSlice.actions;

export default chatsSlice.reducer;
