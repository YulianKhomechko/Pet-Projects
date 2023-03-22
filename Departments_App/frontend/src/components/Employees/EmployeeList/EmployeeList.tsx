import { ArrowCircleLeftIcon, HomeIcon, PlusIcon } from '@heroicons/react/solid';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, LoadingScreen, LoadingSpinner, Paginate } from '../../_common';
import EmployeeCard from '../EmployeeCard/EmployeeCard';
import { defaultResultsLimit } from '../../../constants/pagination';
import { loadingStatus, operationLoadingStatus } from '../../../constants/statusTypes';
import { userRoles } from '../../../constants/userRoles';
import { selectAuth } from '../../../store/authSlice';
import { selectEmployees } from '../../../store/employeesSlice';
import { fetchDepartment } from '../../../thunks/departmentsThunk';
import { fetchEmployees } from '../../../thunks/employeesThunk';
import classes from './EmployeeList.module.scss';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Department } from '../../../models/Department';

export default function EmployeeList() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { departmentId } = useParams();
    const { search } = useLocation();
    const {
        employees: { count, rows },
        status
    } = useAppSelector(selectEmployees);
    const { userRole } = useAppSelector(selectAuth);
    const [department, setDepartment] = useState<Department>();

    useEffect(() => {
        dispatch(fetchDepartment(+departmentId!))
            .unwrap()
            .then(({ data }) => setDepartment(data))
            .catch((err) => navigate('/departments', { replace: true }));
    }, []);

    useEffect(() => {
        dispatch(fetchEmployees({ departmentId: +departmentId!, query: search }))
            .unwrap()
            .catch((err) => navigate(`/departments`, { replace: true }));
    }, [search]);

    return (
        <>
            {status === loadingStatus && (
                <div className={'centered'}>
                    <LoadingSpinner />
                </div>
            )}
            {status !== loadingStatus && department && (
                <div className={`details-container ${classes['employee-list']}`}>
                    <div className={classes['nav-buttons']}>
                        <Button
                            className={'btn-success'}
                            onClick={() => navigate(`/departments/${departmentId}/details`)}>
                            <ArrowCircleLeftIcon className={'w-7 h-7 mr-2'} />
                            Department
                        </Button>
                        <Button className={'btn-primary'} onClick={() => navigate('/departments')}>
                            <HomeIcon className={`w-7 h-7`} />
                            Home
                        </Button>
                    </div>
                    <h2 className={classes['employee-list__header']}>
                        <span className={classes['department-name']}>{department.name}</span> Employees
                    </h2>
                    {[userRoles.admin, userRoles.head].includes(userRole!) && (
                        <Button
                            className={`btn-success ${classes['employee-list__add']}`}
                            onClick={() => navigate(`/departments/${departmentId}/employees/add`)}>
                            Add Employee
                            <PlusIcon className="w-7 h-7 ml-2" />
                        </Button>
                    )}

                    {rows.length !== 0 && (
                        <table className={classes['employees']}>
                            {status === operationLoadingStatus && <LoadingScreen />}
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Birth Date</th>
                                    <th>Email</th>
                                    <th>Salary</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((employee) => (
                                    <EmployeeCard
                                        id={employee.id}
                                        departmentId={employee.departmentId}
                                        firstName={employee.firstName}
                                        lastName={employee.lastName}
                                        birthDate={employee.birthDate}
                                        email={employee.email}
                                        salary={employee.salary}
                                        key={employee.id}
                                    />
                                ))}
                            </tbody>
                        </table>
                    )}
                    {rows.length === 0 && (
                        <div className={'centered'}>
                            <h1>No Employees Found</h1>
                        </div>
                    )}

                    <Paginate pageCount={Math.ceil(count / defaultResultsLimit)} />
                </div>
            )}
        </>
    );
}
