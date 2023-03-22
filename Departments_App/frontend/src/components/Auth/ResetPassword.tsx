import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Button } from '../_common';
import { resetPasswordThunk } from '../../thunks/authThunk';
import { isEmailValid, isFormikShowError } from '../../utils/utils';
import { formikValidator } from '../../utils/validators/formikValidator';
import messages from '../../utils/validators/messages';
import { useAppDispatch } from '../../store/hooks';

const { invalidEmail } = messages;

export default function ResetPassword() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const formik = useFormik({
        initialValues: {
            email: ''
        },
        validate: (values) => {
            return formikValidator(values, {
                email: {
                    required: true,
                    validate: {
                        validator: isEmailValid,
                        message: invalidEmail
                    }
                }
            });
        },
        onSubmit: (values) => {
            dispatch(resetPasswordThunk(values))
                .unwrap()
                .then(() => navigate('/login', { replace: true }))
                .catch((err) => err);
        }
    });

    return (
        <form className="form" onSubmit={formik.handleSubmit}>
            <h2 className={`form__title`}>Restore Password</h2>

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

            <div className="actions flex mt-2 justify-center gap-4">
                <Button className="btn btn-danger" onClick={() => navigate('/login', { replace: true })}>
                    Cancel
                </Button>
                <Button type={'submit'} className={`btn-success submit`}>
                    Submit
                </Button>
            </div>
        </form>
    );
}
