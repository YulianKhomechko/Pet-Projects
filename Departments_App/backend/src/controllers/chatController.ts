import { Response, NextFunction } from 'express';
import {
    createChatService,
    createMessageService,
    getChatsService,
    getMessagesService
} from '../services/chatService.js';
import { httpMessages } from '../utils/http/httpMessages.js';
import { httpStatusCodes } from '../utils/http/httpStatusCodes.js';
import { ChatParams } from '../constants/Params.js';
import { MessageModel } from '../models/sequelizeModels/Chat.js';
import { ExtendedRequest } from '../constants/ExtendedRequest.js';

// This controller is not used in application. Only in postman.
export const getChats = async (req: ExtendedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user!.userId;

        const chats = await getChatsService(userId);

        res.status(httpStatusCodes.statusOK).json(chats);
    } catch (error) {
        next(error);
    }
};

interface CreateChatBody {
    chatName: string;
    receiverUserId: number;
}

// This controller is not used in application. Only in postman.
export const createChat = async (
    req: ExtendedRequest<{}, CreateChatBody>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const { chatName, receiverUserId } = req.body;

        const chat = await createChatService(userId, receiverUserId, chatName);

        res.statusMessage = httpMessages.statusEntityCreate;
        res.status(httpStatusCodes.statusCreated).json(chat);
    } catch (error) {
        next(error);
    }
};

// This controller is not used in application. Only in postman.
export const getMessages = async (
    req: ExtendedRequest<ChatParams>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { chatId } = req.params;

        const messages = await getMessagesService(+chatId);

        res.status(httpStatusCodes.statusOK).json(messages);
    } catch (error) {
        next(error);
    }
};

type CreateMessageBody = Pick<MessageModel, 'text'>;

// This controller is not used in application. Only in postman.
export const createMessage = async (
    req: ExtendedRequest<ChatParams, CreateMessageBody>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const { chatId } = req.params;
        const { text } = req.body;

        const message = await createMessageService(+userId, +chatId, text);

        res.statusMessage = httpMessages.statusEntityCreate;
        res.status(httpStatusCodes.statusCreated).json(message);
    } catch (error) {
        next(error);
    }
};
