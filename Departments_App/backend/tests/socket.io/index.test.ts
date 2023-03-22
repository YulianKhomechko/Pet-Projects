jest.mock('../../src/models/sequelizeModels/Chat.js');
jest.mock('../../src/services/chatService.js');

import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as Client } from 'socket.io-client';
import { AddressInfo } from 'net';
import Mock = jest.Mock;
import * as chatModule from '../../src/models/sequelizeModels/Chat.js';
import * as chatServiceModule from '../../src/services/chatService.js';
import { ChatEvents } from '../../src/constants/ChatEvents';
import { chatRoom, generateRoomName, setChatListeners } from '../../src/socket.io/setChatListeners';

jest.setTimeout(10000);

let io: any, serverSocket: any, clientSocket: any;

beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
        const port = (httpServer.address() as AddressInfo).port;
        clientSocket = Client(`http://localhost:${port}`);
        io.on('connection', (socket: any) => {
            serverSocket = socket;


            setChatListeners(serverSocket, io);
        });

        clientSocket.on('connect', done);
    });
});

afterAll(() => {
    io.close();
    clientSocket.close();
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('socket.io', () => {
    it('should send chats to the client when client emitted "chat_initialize"', (done) => {
        const mockChats = [{ id: 1, userId: 1 }];

        (chatServiceModule.getChatsService as Mock).mockImplementationOnce(async () => mockChats);

        clientSocket.on(ChatEvents.CHAT_INITIALIZED, (chats: any) => {
            expect(chats).toEqual(mockChats);
            done();
        });

        clientSocket.emit(ChatEvents.CHAT_INITIALIZE);
    });

    it('should join a correct room when client emitted "chat_join"', (done) => {
        const testChatId = 1;
        const roomName = generateRoomName(chatRoom, testChatId);

        clientSocket.emit(ChatEvents.CHAT_JOIN, testChatId);

        expect(Array.from<string>(serverSocket.rooms).some((el: string) => el === roomName)).toBeTruthy();

        done();
    });

    describe('chat_create event', () => {
        const testCreatorUserId = 1;
        const testReceiverUserId = 2;
        const mockCreatorChats = [{ id: 1, userId: testCreatorUserId }];
        const mockReceiverChats = [{ id: 2, userId: testReceiverUserId }];
        const mockCreatedChat = { id: 3, userId: testCreatorUserId };

        afterEach(() => {
            clientSocket.off(ChatEvents.CHAT_CREATED);
        });

        it('should send object with chatId property to the client if they have common chat', (done) => {
            const mockDBChat = { id: 1 };

            (chatModule.chat.findAll as Mock).mockImplementation(async () => [mockDBChat]);

            clientSocket.on(ChatEvents.CHAT_CREATED, (chat: any) => {
                expect(chat.chatId).toBe(mockDBChat.id);
                done();
            });

            clientSocket.emit(ChatEvents.CHAT_CREATE, { userId: testCreatorUserId }, testReceiverUserId);
        });

        it('should create a new chat and send it to the client if common chat was not found', (done) => {
            (chatModule.chat.findAll as Mock).mockImplementation(async (options: any) => {
                if (options.where.userId === testCreatorUserId) {
                    return mockCreatorChats;
                }

                if (options.where.userId === testReceiverUserId) {
                    return mockReceiverChats;
                }

                return [];
            });

            (chatServiceModule.createChatService as Mock).mockImplementationOnce(async () => mockCreatedChat);
            (chatModule.chatUser.create as Mock).mockImplementation(async () => undefined);

            clientSocket.on(ChatEvents.CHAT_CREATED, (createdChat: any) => {
                expect(createdChat).toEqual(mockCreatedChat);
                done();
            });

            clientSocket.emit(ChatEvents.CHAT_CREATE, { userId: testCreatorUserId }, testReceiverUserId);
        });
    });

    it('should return messages when client emitted message_retrieve', (done) => {
        const mockMessages = [{ userId: 1, chatId: 1, text: 'testMessage' }];

        (chatServiceModule.getMessagesService as Mock).mockImplementationOnce(async () => mockMessages);

        clientSocket.on(ChatEvents.MESSAGE_RETRIEVED, (messages: any[]) => {
            expect(messages).toEqual(mockMessages);
            done();
        });

        clientSocket.emit(ChatEvents.MESSAGE_RETRIEVE);
    });

    it('should post new message into the database and return in to the client when client emitted message_create', (done) => {
        const mockCreatedMessage = { userId: 1, chatId: 1, text: 'createdMessage' };

        (chatServiceModule.createMessageService as Mock).mockImplementationOnce(async () => mockCreatedMessage);

        clientSocket.on(ChatEvents.MESSAGE_CREATED, (message: any) => {
            expect(message).toEqual(mockCreatedMessage);
            done();
        });

        clientSocket.emit(ChatEvents.MESSAGE_CREATE, mockCreatedMessage);
    });
});
