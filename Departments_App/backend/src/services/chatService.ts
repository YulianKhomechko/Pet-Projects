import ServerError from '../models/Errors/ServerError.js';
import { chat, user, message, chatUser } from '../models/sequelizeModels/index.js';
import { httpErrors } from '../utils/http/httpErrors.js';
import { httpStatusCodes } from '../utils/http/httpStatusCodes.js';
import { ChatModel, MessageModel } from '../models/sequelizeModels/Chat.js';
import { UserModel } from '../models/sequelizeModels/User.js';

export const getChatsService = async (userId: UserModel['id']): Promise<ChatModel[]> => {
    const fetchedUser = await user.findByPk(userId);
    if (!fetchedUser) {
        throw new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist);
    }

    return await (fetchedUser as Required<UserModel>).getChats({
        include: [
            {
                model: user,
                through: { attributes: [] },
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    });
};

export const createChatService = async (
    userId: UserModel['id'],
    receiverUserId: UserModel['id'],
    chatName: ChatModel['chatName']
): Promise<ChatModel> => {
    const createdChatId = (await chat.create({ userId, chatName })).id;

    await chatUser.create({ chatId: createdChatId, userId });
    await chatUser.create({
        chatId: createdChatId,
        userId: receiverUserId
    });

    const createdChat = await chat.findByPk(createdChatId, {
        include: [
            {
                model: user,
                through: { attributes: [] },
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    });

    createdChat!.receiverUserId = receiverUserId;

    return createdChat!;
};

export const getMessagesService = async (chatId: ChatModel['id']): Promise<MessageModel[]> => {
    const fetchedChat = await chat.findByPk(chatId);
    if (!fetchedChat) {
        throw new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist);
    }

    return await message.findAll({
        where: { chatId },
        include: [{ model: user, attributes: ['firstName', 'lastName'] }]
    });
};

export const createMessageService = async (
    userId: UserModel['id'],
    chatId: MessageModel['chatId'],
    text: MessageModel['text']
): Promise<MessageModel> => {
    const fetchedChat = await chat.findByPk(chatId);
    if (!fetchedChat) {
        throw new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist);
    }

    const messageId = (await message.create({ userId, chatId, text })).id;
    const fetchedMessage = await message.findByPk(messageId, {
        include: [{ model: user, attributes: ['firstName', 'lastName'] }]
    });

    if (!fetchedMessage) {
        throw new ServerError(httpStatusCodes.statusNotFound, httpErrors.entityNotExist);
    }

    return fetchedMessage;
};
