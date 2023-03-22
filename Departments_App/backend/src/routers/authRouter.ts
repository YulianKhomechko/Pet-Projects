import express from 'express';
import { login, logout, register, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);

router.post('/logout', logout);

router.post('/register', register);

router.patch('/reset-password', resetPassword);

export default router;
