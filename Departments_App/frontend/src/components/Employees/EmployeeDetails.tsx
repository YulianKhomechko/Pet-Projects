import { ArrowCircleLeftIcon } from '@heroicons/react/solid';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loadingStatus } from '../../constants/statusTypes';
import { selectEmployees } from '../../store/employeesSlice';
import { fetchEmployee } from '../../thunks/employeesThunk';
import { Button, LoadingSpinner } from '../_common';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Employee } from '../../models/Employee';

export default function EmployeeDetails() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { departmentId, employeeId } = useParams();
    const { status } = useAppSelector(selectEmployees);
    const [employee, setEmployee] = useState<Employee>();

    useEffect(() => {
        dispatch(fetchEmployee({ departmentId: +departmentId!, employeeId: +employeeId! }))
            .unwrap()
            .then(({ data }) => setEmployee(data))
            .catch((err) => navigate(`/departments/${departmentId}/employees`, { replace: true }));
    }, []);

    return (
        <>
            {status === loadingStatus && (
                <div className={'centered'}>
                    <LoadingSpinner />
                </div>
            )}
            {status !== loadingStatus && employee && (
                <div className="details-container">
                    <div className="flex justify-end">
                        <Button
                            className={'btn-success'}
                            onClick={() => navigate(`/departments/${departmentId}/employees`)}>
                            <ArrowCircleLeftIcon className={'w-7 h-7 mr-2'} />
                            Employee List
                        </Button>
                    </div>
                    <h2 className="font-semibold uppercase">{`${employee.firstName} ${employee.lastName}`}</h2>
                    <h3>Birth Date: {new Date(employee.birthDate).toLocaleDateString()}</h3>
                    <h3>Email: {employee.email}</h3>
                    <h3>Salary: {employee.salary}</h3>
                </div>
            )}
        </>
    );
}
