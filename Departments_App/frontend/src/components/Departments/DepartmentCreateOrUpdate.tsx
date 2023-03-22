import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loadingStatus } from '../../constants/statusTypes';
import { selectDepartments } from '../../store/departmentsSlice';
import { createDepartment, fetchDepartment, updateDepartment } from '../../thunks/departmentsThunk';
import { isFormikShowError } from '../../utils/utils';
import validate from '../../utils/validators/departments/departmentsValidator';
import { Button, LoadingSpinner } from '../_common';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Department } from '../../models/Department';

export default function DepartmentCreateOrUpdate() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { departmentId } = useParams();
    const { status } = useAppSelector(selectDepartments);
    const [department, setDepartment] = useState<Department>();

    const formik = useFormik({
        initialValues: {
            name: departmentId ? (department ? department.name : '') : '',
            head: departmentId ? (department ? department.head : '') : '',
            description: department?.description || ''
        },
        validate,
        onSubmit: (values) => {
            const data = values;
            if (!departmentId) {
                dispatch(createDepartment(data));
            } else {
                dispatch(updateDepartment({ departmentId: +departmentId, data }));
            }
            navigate(-1);
        },
        enableReinitialize: true
    });

    useEffect(() => {
        if (!departmentId) {
            return;
        }

        dispatch(fetchDepartment(+departmentId))
            .unwrap()
            .then(({ data }) => setDepartment(data))
            .catch((err) => navigate('/departments', { replace: true }));
    }, []);

    return (
        <form className={'form'} onSubmit={formik.handleSubmit}>
            {status === loadingStatus && (
                <div className={'centered'}>
                    <LoadingSpinner />
                </div>
            )}
            {status !== loadingStatus && (departmentId ? department : true) && (
                <>
                    <h2 className={'form__title'}>
                        {departmentId ? `Update ${department?.name}` : 'Create Department'}
                    </h2>
                    <label className={'label'} htmlFor={'name'}>
                        Department Name<span className={'required'}>*</span>
                    </label>
                    <input
                        className={`input ${isFormikShowError(formik, 'name') ? 'error' : ''}`}
                        type={'text'}
                        name={'name'}
                        id={'name'}
                        placeholder={'IT Department'}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                    />
                    {isFormikShowError(formik, 'name') ? (
                        <div className={'error-message'}>{formik.errors.name}</div>
                    ) : null}

                    <label className={'label'} htmlFor={'head'}>
                        Head of the Department<span className={'required'}>*</span>
                    </label>
                    <input
                        className={`input ${isFormikShowError(formik, 'head') ? 'error' : ''}`}
                        type={'text'}
                        name={'head'}
                        id={'head'}
                        placeholder={'John Smith'}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.head}
                    />
                    {isFormikShowError(formik, 'head') ? (
                        <div className={'error-message'}>{formik.errors.head}</div>
                    ) : null}

                    <label className={'label'} htmlFor={'description'}>
                        Description
                    </label>
                    <textarea
                        className={`textarea  ${isFormikShowError(formik, 'description') ? 'error' : ''}`}
                        name={'description'}
                        id={'description'}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.description}></textarea>
                    {isFormikShowError(formik, 'description') ? (
                        <div className={'error-message'}>{formik.errors.description}</div>
                    ) : null}

                    <div className={'form__actions'}>
                        <Button className={'btn-danger'} onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                        <Button type={'submit'} className={`btn-success submit}`}>
                            Submit
                        </Button>
                    </div>
                </>
            )}
        </form>
    );
}
