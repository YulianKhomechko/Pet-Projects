import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { loginThunk } from '../../thunks/authThunk';
import { isFormikShowError } from '../../utils/utils';
import validate from '../../utils/validators/auth/login/loginValidator';
import { Button } from '../_common';
import { useAppDispatch } from '../../store/hooks';

export default function Login() {
    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validate,
        onSubmit: (values) => {
            dispatch(loginThunk(values));
        }
    });

    return (
        <form className="form" onSubmit={formik.handleSubmit}>
            <h2 className={`form__title`}>Login</h2>

            <label className="label" htmlFor="email">
                Email:
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
                Password:
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

            <div className="flex justify-between">
                <Link className="underline hover:no-underline text-indigo-600" to="/reset-password">
                    Forgot Password
                </Link>
                <Link className="underline hover:no-underline text-indigo-600" to="/signup">
                    Sign Up
                </Link>
            </div>
        </form>
    );
}
