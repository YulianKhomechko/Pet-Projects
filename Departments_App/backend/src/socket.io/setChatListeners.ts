import { Server, Socket } from 'socket.io';
import { ChatEvents } from '../constants/ChatEvents.js';
import {
    createChatService,
    createMessageService,
    getChatsService,
    getMessagesService
} from '../services/chatService.js';
import { chat, ChatModel } from '../models/sequelizeModels/Chat.js';

export const chatRoom = 'Chat';
export const generateRoomName = (roomName: string, roomId: number) => `${roomName}:${roomId}`;

export const setChatListeners = (socket: Socket, io: Server) => {
    socket.on(ChatEvents.CHAT_INITIALIZE, async (userId) => {
        const chats = await getChatsService(userId);

        chats.forEach((chat: ChatModel) => {
            socket.join(generateRoomName(chatRoom, chat.id));
        });

        io.to(socket.id).emit(ChatEvents.CHAT_INITIALIZED, chats);
    });

    socket.on(ChatEvents.CHAT_JOIN, (chatId) => {
        socket.join(generateRoomName(chatRoom, chatId));
    });

    socket.on(ChatEvents.CHAT_CREATE, async ({ userId, chatName }, receiverUserId) => {
        const creatorChats = await chat.findAll({ where: { userId: userId } });
        const receiverChats = await chat.findAll({
            where: { userId: receiverUserId }
        });

        const [commonChat] = creatorChats!.filter((creatorChat: ChatModel) =>
            receiverChats!.some((receiverChat: ChatModel) => receiverChat.id === creatorChat.id)
        );

        if (commonChat) {
            io.emit(ChatEvents.CHAT_CREATED, { chatId: commonChat.id });
            return;
        }

        const createdChat = await createChatService(userId, receiverUserId, chatName);

        io.emit(ChatEvents.CHAT_CREATED, createdChat);
    });

    socket.on(ChatEvents.MESSAGE_RETRIEVE, async (chatId) => {
        const messages = await getMessagesService(chatId);

        io.to(socket.id).emit(ChatEvents.MESSAGE_RETRIEVED, messages);
    });

    socket.on(ChatEvents.MESSAGE_CREATE, async ({ userId, chatId, text }) => {
        const message = await createMessageService(userId, chatId, text);

        io.to(generateRoomName(chatRoom, message!.chatId)).emit(ChatEvents.MESSAGE_CREATED, message);
    });

    socket.on(ChatEvents.CHAT_LEAVE_ALL_ROOMS, () => {
        socket.rooms.forEach((room) => {
            if (room.startsWith(chatRoom)) {
                socket.leave(room);
            }
        });
    });

    socket.on('disconnect', () => {});
}