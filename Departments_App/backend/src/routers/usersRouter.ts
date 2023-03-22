import express from 'express';
import { createUser, deleteUser, getUser, updatePassword, updateUser } from '../controllers/usersController.js';
import { protectRoute } from '../middlewares/protectRoute.js';
import { allowToSameUser } from '../middlewares/allowToSameUser.js';
import { userRoles } from '../constants/userRoles.js';

const router = express.Router();

router.route('/').post(protectRoute([userRoles.admin]), createUser);

router
    .route('/:userId')
    .get(allowToSameUser, getUser)
    .patch(allowToSameUser, updateUser)
    .delete(protectRoute([userRoles.admin]), deleteUser);

router.route('/:userId/password').patch(allowToSameUser, updatePassword);

export default router;
