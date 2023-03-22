import { ChatAlt2Icon, InformationCircleIcon, TrashIcon } from '@heroicons/react/outline';
import { PencilAltIcon } from '@heroicons/react/solid';
import Tippy from '@tippyjs/react';
import { useNavigate } from 'react-router-dom';
import 'tippy.js/dist/tippy.css';
import { CHAT_CREATE } from '../../../constants/socket.io';
import { userRoles } from '../../../constants/userRoles';
import { socket } from '../../../services/socket.io';
import { selectAuth } from '../../../store/authSlice';
import { removeEmployee } from '../../../thunks/employeesThunk';
import { Button } from '../../_common';
import classes from './EmployeeCard.module.scss';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Employee } from '../../../models/Employee';

export default function EmployeeCard({
    id,
    departmentId,
    firstName,
    lastName,
    birthDate,
    email,
    salary
}: Omit<Employee, 'userId'>) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { userRole, userId } = useAppSelector(selectAuth);

    const handleCreateChat = () => {
        socket.emit(CHAT_CREATE, { userId }, id);
    };

    const handleDelete = () => {
        dispatch(removeEmployee({ departmentId: departmentId, employeeId: id }));
    };

    return (
        <tr className={classes.employee}>
            <td className={classes.name}>{`${firstName} ${lastName}`}</td>
            <td>{new Date(birthDate).toLocaleDateString()}</td>
            <td>{email}</td>
            <td>{salary}</td>
            <td className={classes['employee__actions']}>
                {id !== userId && (
                    <Tippy content={'Start Chatting'}>
                        <Button
                            className="btn btn-primary btn-small"
                            onClick={handleCreateChat}
                            data-testid="employee-chat-button">
                            <ChatAlt2Icon className="w-5 h-5" />
                        </Button>
                    </Tippy>
                )}

                <Tippy content={'Details'}>
                    <Button
                        className="btn-success btn-small"
                        onClick={() => navigate(`/departments/${departmentId}/employees/${id}/details`)}
                        data-testid="employee-details-button">
                        <InformationCircleIcon className="w-5 h-5" />
                    </Button>
                </Tippy>
                {[userRoles.admin, userRoles.head].includes(userRole!) && (
                    <Tippy content={'Edit'}>
                        <Button
                            className="btn-primary btn-small"
                            onClick={() => navigate(`/departments/${departmentId}/employees/${id}/edit`)}
                            data-testid="employee-edit-button">
                            <PencilAltIcon className="w-5 h-5" />
                        </Button>
                    </Tippy>
                )}
                {[userRoles.admin].includes(userRole!) && (
                    <Tippy content={'Delete'}>
                        <Button
                            className="btn-danger btn-small"
                            onClick={handleDelete}
                            data-testid="employee-delete-button">
                            <TrashIcon className="w-5 h-5" />
                        </Button>
                    </Tippy>
                )}
            </td>
        </tr>
    );
}
