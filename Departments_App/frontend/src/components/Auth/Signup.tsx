import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../_common';
import { registrationThunk } from '../../thunks/authThunk';
import { isFormikShowError } from '../../utils/utils';
import validateSignup from '../../utils/validators/auth/registration/registrationValidator';
import { useAppDispatch } from '../../store/hooks';

export default function Signup() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        },
        validate: validateSignup,
        onSubmit: (values) => {
            dispatch(registrationThunk(values))
                .unwrap()
                .then(() => navigate('/login'))
                .catch((err) => err);
        }
    });

    return (
        <form className="form" onSubmit={formik.handleSubmit}>
            <h2 className={`form__title`}>Register</h2>

            <label className={'label'} htmlFor={'firstName'}>
                First Name:<span className={'required'}>*</span>
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
                Last Name:<span className={'required'}>*</span>
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

            <label className="label" htmlFor="email">
                Email:<span className={'required'}>*</span>
            </label>
            <input
                className={`input ${isFormikShowError(formik, 'email') ? 'error' : ''}`}
                type="email"
                name="email"
                placeholder={'example@mail.com'}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                id="email"
            />
            {isFormikShowError(formik, 'email') ? <div className={'error-message'}>{formik.errors.email}</div> : null}

            <label className="label" htmlFor="password">
                Password:<span className={'required'}>*</span>
            </label>
            <input
                className={`input ${isFormikShowError(formik, 'password') ? 'error' : ''}`}
                type="password"
                name="password"
                placeholder="********"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                id="password"
            />
            {isFormikShowError(formik, 'password') ? (
                <div className={'error-message'}>{formik.errors.password}</div>
            ) : null}

            <Button type={'submit'} className={`btn-success submit mt-2 mx-auto`}>
                Submit
            </Button>

            <div className="text-right">
                <Link className="underline hover:no-underline text-indigo-600" to="/login">
                    I have an account
                </Link>
            </div>
        </form>
    );
}
