import crypto from 'crypto';

export const generateRandomPassword = (length = 10) => crypto.randomBytes(length).toString('hex');
