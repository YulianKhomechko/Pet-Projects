/**
 * @jest-environment node
 */

import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as Client } from 'socket.io-client';
import { AddressInfo } from 'net';
import { CHAT_CREATED, CHAT_INITIALIZED, MESSAGE_RETRIEVED } from '../../constants/socket.io';
import { setChatSocketListeners } from './setChatListeners';
import { addChat, setChats, setMessages } from '../../store/chatsSlice';

let io: any,
    serverSocket: any,
    clientSocket: any,
    testUserId = 1,
    mockNavigate = jest.fn(),
    mockDispatch = jest.fn();

beforeAll((done) => {
    jest.mock('../../store/chatsSlice');
    jest.mock('./index');

    // set up socket
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
        const port = (httpServer.address() as AddressInfo).port;
        clientSocket = Client(`http://localhost:${port}`);
        io.on('connection', (socket: any) => {
            serverSocket = socket;
            setChatSocketListeners(clientSocket, mockDispatch, mockNavigate, testUserId);
        });
        clientSocket.on('connect', done);
    });
});

afterAll(() => {
    io.close();
    clientSocket.close();
});

describe('socket.io', () => {
    describe(`${CHAT_INITIALIZED} event`, () => {
        const mockChats = [{ id: 1, userId: 1 }];

        afterEach(() => {
            clientSocket.off(CHAT_INITIALIZED);
        });

        it(`should receive chats on ${CHAT_INITIALIZED} event`, (done) => {
            clientSocket.on(CHAT_INITIALIZED, (chats: any) => {
                expect(chats).toEqual(mockChats);

                done();
            });

            serverSocket.emit(CHAT_INITIALIZED, mockChats);
        });

        it(`should dispatch setChats with received chats`, (done) => {
            clientSocket.on(CHAT_INITIALIZED, (chats: any) => {
                expect(mockDispatch).toBeCalledWith(setChats(mockChats));

                done();
            });

            serverSocket.emit(CHAT_INITIALIZED, mockChats);
        });
    });

    describe(`${CHAT_CREATED} event`, () => {
        afterEach(() => {
            clientSocket.off(CHAT_CREATED);
        });

        it(`should receive chat on ${CHAT_CREATED} event`, (done) => {
            const mockChat = { id: 1, userId: 1 };

            clientSocket.on(CHAT_CREATED, (chat: any) => {
                expect(chat).toEqual(mockChat);

                done();
            });

            serverSocket.emit(CHAT_CREATED, mockChat);
        });

        it('should call navigate with appropriate argument if chat contains chatId property', (done) => {
            const mockChat = { id: 1, userId: 1, chatId: 1 };

            clientSocket.on(CHAT_CREATED, (chat: any) => {
                expect(mockNavigate).toBeCalledWith(`/chat/${chat.chatId}`);

                done();
            });

            serverSocket.emit(CHAT_CREATED, mockChat);
        });

        describe('adding chat', () => {
            afterEach(() => {
                clientSocket.off(CHAT_CREATED);
            });

            it('should dispatch add chat with received chat if chat was created by user', (done) => {
                const mockChat = { id: 1, userId: testUserId };

                clientSocket.on(CHAT_CREATED, (chat: any) => {
                    expect(mockDispatch).toBeCalledWith(addChat(chat));

                    done();
                });

                serverSocket.emit(CHAT_CREATED, mockChat);
            });

            it('should navigate to chat if chat was created by user', (done) => {
                const mockChat = { id: 1, userId: testUserId };

                clientSocket.on(CHAT_CREATED, (chat: any) => {
                    expect(mockNavigate).toBeCalledWith(`/chat/${chat.id}`);

                    done();
                });

                serverSocket.emit(CHAT_CREATED, mockChat);
            });
        });
    });

    describe(`${MESSAGE_RETRIEVED} event`, () => {
        const mockMessages = [{ id: 1, userId: 1, text: 'test text' }];

        afterEach(() => {
            clientSocket.off(MESSAGE_RETRIEVED);
        });

        it(`should receive a messages on ${MESSAGE_RETRIEVED}`, (done) => {
            clientSocket.on(MESSAGE_RETRIEVED, (messages: any[]) => {
                expect(messages).toEqual(mockMessages);

                done();
            });

            serverSocket.emit(MESSAGE_RETRIEVED, mockMessages);
        });

        it('should dispatch setMessages and pass received messages as an argument', (done) => {
            clientSocket.on(MESSAGE_RETRIEVED, (messages: any[]) => {
                expect(mockDispatch).toBeCalledWith(setMessages(messages));

                done();
            });

            serverSocket.emit(MESSAGE_RETRIEVED, mockMessages);
        });
    });
});
