import { errorModel } from '../models/sequelizeModels/index.js';
import ServerError from '../models/Errors/ServerError.js';

export const createError = async (error: ServerError): Promise<void> => {
    const formattedError = {
        statusCode: error.statusCode,
        statusMessage: error.message
    };
    await errorModel.create(formattedError);
};
