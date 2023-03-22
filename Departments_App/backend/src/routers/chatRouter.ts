import express from 'express';
import { createChat, createMessage, getChats, getMessages } from '../controllers/chatController.js';

const router = express.Router();

router.route('/').get(getChats).post(createChat);

router.route('/:chatId').get(getMessages).post(createMessage);

export default router;
