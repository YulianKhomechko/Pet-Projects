import express from 'express';
import {
    createEmployee,
    deleteEmployee,
    getEmployee,
    getEmployees,
    updateEmployee
} from '../controllers/employeesController.js';
import { protectRoute } from '../middlewares/protectRoute.js';
import { userRoles } from '../constants/userRoles.js';

const router = express.Router();

router
    .route('/:departmentId/employees')
    .get(getEmployees)
    .post(protectRoute([userRoles.admin, userRoles.head]), createEmployee);

router
    .route('/:departmentId/employees/:employeeId')
    .get(getEmployee)
    .patch(protectRoute([userRoles.admin, userRoles.head]), updateEmployee)
    .delete(protectRoute([userRoles.admin, userRoles.head]), deleteEmployee);

export default router;
