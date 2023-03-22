import fs from 'fs';
import morgan from 'morgan';

const morganFormat = ':method :url :status';

export const logInfo = morgan(morganFormat, {
    skip: (req, res) => res.statusCode >= 400,
    stream: fs.createWriteStream('./logs/infoLogs.txt', { flags: 'a' })
});

export const logError = morgan(morganFormat, {
    skip: (req, res) => res.statusCode <= 400,
    stream: fs.createWriteStream('./logs/errorLogs.txt', { flags: 'a' })
});
