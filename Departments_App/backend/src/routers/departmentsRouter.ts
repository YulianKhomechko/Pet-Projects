import express from 'express';
import {
    createDepartment,
    deleteDepartment,
    getDepartment,
    getDepartments,
    updateDepartment
} from '../controllers/departmentsController.js';
import { protectRoute } from '../middlewares/protectRoute.js';
import { userRoles } from '../constants/userRoles.js';

const router = express.Router();

router
    .route('/')
    .get(getDepartments)
    .post(protectRoute([userRoles.admin]), createDepartment);

router
    .route('/:departmentId')
    .get(getDepartment)
    .patch(protectRoute([userRoles.admin, userRoles.head]), updateDepartment)
    .delete(protectRoute([userRoles.admin]), deleteDepartment);

export default router;
