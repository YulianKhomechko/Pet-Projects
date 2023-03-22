import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../Auth/Login';
import Signup from '../Auth/Signup';
import ResetPassword from '../Auth/ResetPassword';
import { ProtectedRoute } from './index';
import DepartmentList from '../Departments/DepartmentList/DepartmentList';
import { userRoles } from '../../constants/userRoles';
import ChatPage from '../Chat/ChatPage/ChatPage';
import { useAppSelector } from '../../store/hooks';
import { selectAuth } from '../../store/authSlice';
import { lazy } from 'react';

const DepartmentDetails = lazy(() => import('./../Departments/DepartmentDetails/DepartmentDetails'));
const DepartmentCreateOrUpdate = lazy(() => import('./../Departments/DepartmentCreateOrUpdate'));
const EmployeeList = lazy(() => import('./../Employees/EmployeeList/EmployeeList'));
const EmployeeDetails = lazy(() => import('./../Employees/EmployeeDetails'));
const EmployeeCreateOrUpdate = lazy(() => import('./../Employees/EmployeeCreateOrUpdate'));
const ChatBox = lazy(() => import('./../Chat/ChatBox'));
const ChangeUserPassword = lazy(() => import('./../User/ChangePassword'));
const UserDetails = lazy(() => import('./../User/UserDetails'));
const NotFound = lazy(() => import('./NotFound/NotFound'));

export default function RouterComponent() {
    const { userId } = useAppSelector(selectAuth);

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={userId ? <Navigate to="/" replace={true} /> : <Login />} />
            <Route path="/signup" element={userId ? <Navigate to="/" replace={true} /> : <Signup />} />
            <Route path="/reset-password" element={userId ? <Navigate to="/" replace={true} /> : <ResetPassword />} />

            <Route path="/" element={<Navigate to="/departments" replace={true} />} />

            {/* Private Routes */}
            {/* Departments */}
            <Route path="/departments" element={<ProtectedRoute component={DepartmentList} />} />
            <Route
                path="/departments/add"
                element={<ProtectedRoute component={DepartmentCreateOrUpdate} allowedTo={[userRoles.admin]} />}
            />
            <Route
                path="/departments/:departmentId/details"
                element={<ProtectedRoute component={DepartmentDetails} />}
            />
            <Route
                path="/departments/:departmentId/edit"
                element={
                    <ProtectedRoute
                        component={DepartmentCreateOrUpdate}
                        allowedTo={[userRoles.admin, userRoles.head]}
                    />
                }
            />
            {/* Employees */}
            <Route path="/departments/:departmentId/employees" element={<ProtectedRoute component={EmployeeList} />} />
            <Route
                path="/departments/:departmentId/employees/add"
                element={
                    <ProtectedRoute component={EmployeeCreateOrUpdate} allowedTo={[userRoles.admin, userRoles.head]} />
                }
            />
            <Route
                path="/departments/:departmentId/employees/:employeeId/details"
                element={<ProtectedRoute component={EmployeeDetails} />}
            />
            <Route
                path="/departments/:departmentId/employees/:employeeId/edit"
                element={
                    <ProtectedRoute component={EmployeeCreateOrUpdate} allowedTo={[userRoles.admin, userRoles.head]} />
                }
            />
            {/* User */}
            <Route path="/user" element={<ProtectedRoute component={UserDetails} />}>
                <Route path="password" element={<ProtectedRoute component={ChangeUserPassword} />} />
            </Route>
            {/* Chat */}
            <Route path="/chat" element={<ProtectedRoute component={ChatPage} />}>
                <Route path=":chatId" element={<ProtectedRoute component={ChatBox} />} />
            </Route>

            {/* Not Found*/}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
