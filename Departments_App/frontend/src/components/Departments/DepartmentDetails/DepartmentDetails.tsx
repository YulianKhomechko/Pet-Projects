import { ArrowCircleLeftIcon, ArrowCircleRightIcon, PencilAltIcon, TrashIcon } from '@heroicons/react/solid';
import Tippy from '@tippyjs/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'tippy.js/dist/tippy.css';
import { loadingStatus, operationLoadingStatus } from '../../../constants/statusTypes';
import { userRoles } from '../../../constants/userRoles';
import { selectAuth } from '../../../store/authSlice';
import { selectDepartments } from '../../../store/departmentsSlice';
import { fetchDepartment, removeDepartment } from '../../../thunks/departmentsThunk';
import { Button, LoadingScreen, LoadingSpinner } from '../../_common';
import classes from './DepartmentDetails.module.scss';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Department } from '../../../models/Department';

export default function DepartmentDetails() {
    const { departmentId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { status } = useAppSelector(selectDepartments);
    const { userRole } = useAppSelector(selectAuth);
    const [department, setDepartment] = useState<Department>();

    useEffect(() => {
        dispatch(fetchDepartment(+departmentId!))
            .unwrap()
            .then(({ data }) => setDepartment(data))
            .catch((err) => navigate('/departments', { replace: true }));
    }, []);

    const onDelete = () => {
        dispatch(removeDepartment(+departmentId!))
            .unwrap()
            .then(() => navigate('/departments'))
            .catch((err) => err);
    };

    return (
        <div className="details-container">
            {status === loadingStatus && (
                <div className={'centered'}>
                    <LoadingSpinner />
                </div>
            )}
            {status !== loadingStatus && department && (
                <div className={classes['department-details']}>
                    {status === operationLoadingStatus && <LoadingScreen />}
                    <div className={classes['departments-button']}>
                        <Button className={'btn-success'} onClick={() => navigate('/departments')}>
                            <ArrowCircleLeftIcon className={'w-7 h-7 mr-2'} />
                            Departments
                        </Button>
                    </div>
                    <h1 className={classes['department-details__title']}>Department Details</h1>
                    <h2 className={classes['department-details__name']}>{department.name}</h2>
                    <h3 className={classes['department-details__head']}>{department.head}</h3>
                    <div className={classes['department-details__actions']}>
                        {[userRoles.admin, userRoles.head].includes(userRole!) && (
                            <Tippy content={'Edit'}>
                                <Button
                                    className="btn-primary"
                                    onClick={() => navigate(`/departments/${departmentId}/edit`)}>
                                    <PencilAltIcon className="w-7 h-7" />
                                </Button>
                            </Tippy>
                        )}

                        {[userRoles.admin].includes(userRole!) && (
                            <Tippy content={'Delete'}>
                                <Button className="btn-danger" onClick={onDelete}>
                                    <TrashIcon className="w-7 h-7" />
                                </Button>
                            </Tippy>
                        )}
                    </div>
                    <Button
                        className={`btn-primary ${classes['department-details__employees']}`}
                        onClick={() => navigate(`/departments/${departmentId}/employees`)}>
                        Employees
                        <ArrowCircleRightIcon className="w-7 h-7 ml-4" />
                    </Button>
                    <p className={classes['department-details__description']}>{department.description}</p>
                </div>
            )}
        </div>
    );
}
