import { PlusIcon } from '@heroicons/react/solid';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, LoadingScreen, LoadingSpinner, Paginate } from '../../_common';

import DepartmentCard from '../DepartmentCard/DepartmentCard';
import { defaultResultsLimit } from '../../../constants/pagination';
import { failedStatus, loadingStatus, operationLoadingStatus } from '../../../constants/statusTypes';
import { userRoles } from '../../../constants/userRoles';
import { selectAuth } from '../../../store/authSlice';
import { selectDepartments } from '../../../store/departmentsSlice';
import { fetchDepartments } from '../../../thunks/departmentsThunk';

import classes from './DepartmentList.module.scss';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

export default function DepartmentList() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { search } = useLocation();
    const { userRole } = useAppSelector(selectAuth);
    const {
        departments: { rows, count },
        status
    } = useAppSelector(selectDepartments);

    useEffect(() => {
        dispatch(fetchDepartments(search));
    }, [search]);

    return (
        <div className={classes.container}>
            <div className={classes['department-list__header']}>
                <h1 className={classes['department-list__title']}>Departments App </h1>
                {[userRoles.admin].includes(userRole!) && (
                    <Button
                        className={`btn-success ${classes['department-list__add']}`}
                        onClick={() => navigate('/departments/add')}>
                        Add Department
                        <PlusIcon className="w-7 h-7 ml-2" />
                    </Button>
                )}
            </div>

            {status === loadingStatus ? (
                <div className={'centered'}>
                    <LoadingSpinner />
                </div>
            ) : (
                <div className={classes['department-list']}>
                    {status === operationLoadingStatus && <LoadingScreen />}
                    {rows &&
                        rows.map((department) => {
                            return (
                                <DepartmentCard
                                    id={department.id}
                                    name={department.name}
                                    head={department.head}
                                    description={department.description}
                                    key={department.id}
                                />
                            );
                        })}
                    {rows && rows.length === 0 && status !== loadingStatus && status !== failedStatus && (
                        <div className={'centered'}>
                            <h1>No Departments Found</h1>
                        </div>
                    )}
                </div>
            )}

            <Paginate pageCount={Math.ceil(count / defaultResultsLimit)} />
        </div>
    );
}
