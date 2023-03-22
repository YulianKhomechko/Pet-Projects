import { ChangeEvent } from 'react';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loadingStatus } from '../../constants/statusTypes';
import { selectEmployees } from '../../store/employeesSlice';
import { createEmployee, fetchEmployee, updateEmployee } from '../../thunks/employeesThunk';
import { isFormikShowError } from '../../utils/utils';
import validate from '../../utils/validators/employees/employeesValidator';
import { Button, LoadingSpinner } from '../_common';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Employee } from '../../models/Employee';

export default function EmployeeCreateOrUpdate() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { departmentId, employeeId } = useParams();
    const { status } = useAppSelector(selectEmployees);
    const [employee, setEmployee] = useState<Employee>();

    useEffect(() => {
        if (!employeeId) {
            return;
        }

        dispatch(fetchEmployee({ departmentId: +departmentId!, employeeId: +employeeId }))
            .unwrap()
            .then(({ data }) => setEmployee(data))
            .catch((err) => navigate(`/departments/${departmentId}/employees`, { replace: true }));
    }, []);

    const formik = useFormik({
        initialValues: {
            firstName: employeeId ? (employee ? employee.firstName : '') : '',
            lastName: employeeId ? (employee ? employee.lastName : '') : '',
            email: employeeId ? (employee ? employee.email : '') : '',
            birthDate: employeeId ? (employee ? employee.birthDate : '') : '',
            salary: employeeId ? (employee ? employee.salary : 0) : 0
        },
        validate,
        onSubmit: (values) => {
            const data = values;
            if (employeeId) {
                dispatch(updateEmployee({ departmentId: +departmentId!, employeeId: +employeeId!, data }));
            } else {
                dispatch(
                    createEmployee({
                        departmentId: +departmentId!,
                        data: { ...data, departmentId: +departmentId! }
                    })
                );
            }
            navigate(-1);
        },
        enableReinitialize: true
    });

    return (
        <form className={'form'} onSubmit={formik.handleSubmit}>
            {status === loadingStatus && (
                <div className={'centered'}>
                    <LoadingSpinner />
                </div>
            )}
            {status !== loadingStatus && (employeeId ? employee : true) && (
                <>
                    <h2 className={'form__title'}>
                        {employeeId ? `Update ${employee?.firstName} ${employee?.lastName}` : 'Add Employee'}
                    </h2>
                    <label className={'label'} htmlFor={'firstName'}>
                        First Name<span className={'required'}>*</span>
                    </label>
                    <input
                        type={'text'}
                        className={`input ${isFormikShowError(formik, 'firstName') ? 'error' : ''}`}
                        name={'firstName'}
                        id={'firstName'}
                        value={formik.values.firstName}
                        placeholder={'John'}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {isFormikShowError(formik, 'firstName') ? (
                        <div className={'error-message'}>{formik.errors.firstName}</div>
                    ) : null}

                    <label className={'label'} htmlFor={'lastName'}>
                        Last Name<span className={'required'}>*</span>
                    </label>
                    <input
                        type={'text'}
                        className={`input ${isFormikShowError(formik, 'lastName') ? 'error' : ''}`}
                        name={'lastName'}
                        id={'lastName'}
                        value={formik.values.lastName}
                        placeholder={'Smith'}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {isFormikShowError(formik, 'lastName') ? (
                        <div className={'error-message'}>{formik.errors.lastName}</div>
                    ) : null}

                    <label className={'label'} htmlFor={'email'}>
                        Email<span className={'required'}>*</span>
                    </label>
                    <input
                        type={'email'}
                        className={`input ${isFormikShowError(formik, 'email') ? 'error' : ''}`}
                        name={'email'}
                        id={'lastName'}
                        value={formik.values.email}
                        placeholder={'example@mail.com'}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {isFormikShowError(formik, 'email') ? (
                        <div className={'error-message'}>{formik.errors.email}</div>
                    ) : null}

                    <label className={'label'} htmlFor={'birthDate'}>
                        Birth Date<span className={'required'}>*</span>
                    </label>
                    <input
                        type={'date'}
                        className={`input input-date ${isFormikShowError(formik, 'birthDate') ? 'error' : ''}`}
                        name={'birthDate'}
                        id={'birthDate'}
                        value={formik.values.birthDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {isFormikShowError(formik, 'birthDate') ? (
                        <div className={'error-message'}>{formik.errors.birthDate}</div>
                    ) : null}

                    <label className={'label'} htmlFor={'salary'}>
                        Salary<span className={'required'}>*</span>
                    </label>
                    <input
                        type={'number'}
                        className={`input ${isFormikShowError(formik, 'salary') ? 'error' : ''}`}
                        name={'salary'}
                        id={'salary'}
                        value={formik.values.salary}
                        onChange={formik.handleChange}
                        onInput={(ev: ChangeEvent<HTMLInputElement>) =>
                            (ev.target.value = ev.target.value.replace(/^0/, ''))
                        }
                        onBlur={formik.handleBlur}
                    />
                    {isFormikShowError(formik, 'salary') ? (
                        <div className={'error-message'}>{formik.errors.salary}</div>
                    ) : null}

                    <div className={'form__actions'}>
                        <Button className={'btn-danger'} onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                        <Button type={'submit'} className={'btn-success'}>
                            Submit
                        </Button>
                    </div>
                </>
            )}
        </form>
    );
}
