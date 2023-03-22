import { useFormik } from 'formik';
import { selectAuth } from '../../store/authSlice';
import { logoutThunk } from '../../thunks/authThunk';
import { changePasswordThunk } from '../../thunks/usersThunk';
import { isFormikShowError, isPasswordValid } from '../../utils/utils';
import { formikValidator } from '../../utils/validators/formikValidator';
import messages from '../../utils/validators/messages';
import { Button } from '../_common';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const { invalidPassword } = messages;

export default function ChangeUserPassword() {
    const dispatch = useAppDispatch();
    const { userId } = useAppSelector(selectAuth);
    const formik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: ''
        },
        validate: (values) => {
            return formikValidator(values, {
                currentPassword: {
                    required: true,
                    validate: {
                        validator: isPasswordValid,
                        message: invalidPassword
                    }
                },
                newPassword: {
                    required: true,
                    validate: {
                        validator: isPasswordValid,
                        message: invalidPassword
                    }
                }
            });
        },
        onSubmit: (values) => {
            dispatch(changePasswordThunk({ userId: userId!, data: values }))
                .unwrap()
                .then(() => dispatch(logoutThunk()))
                .catch();
        }
    });
    return (
        <form className="mt-4 py-2 border-t-2 border-gray-200" onSubmit={formik.handleSubmit}>
            <label className="display: block mb-1" htmlFor="currentPassword">
                Current Password:
            </label>
            <input
                className={`px-2 border-2 border-grey-400 rounded-sm focus:outline-grey-700 ${
                    isFormikShowError(formik, 'currentPassword') ? 'border-red-600' : ''
                }`}
                type="password"
                name="currentPassword"
                placeholder={'********'}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.currentPassword}
                id="currentPassword"
            />
            {isFormikShowError(formik, 'currentPassword') ? (
                <div className={'text-red-600'}>{formik.errors.currentPassword}</div>
            ) : null}

            <label className="display: block mt-2 mb-1" htmlFor="newPassword">
                New Password:
            </label>
            <input
                className={`px-2 border-2 border-grey-400 rounded-sm focus:outline-grey-700 ${
                    isFormikShowError(formik, 'newPassword') ? 'border-red-600' : ''
                }`}
                type="password"
                name="newPassword"
                placeholder="********"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.newPassword}
                id="newPassword"
            />
            {isFormikShowError(formik, 'newPassword') ? (
                <div className="text-red-600">{formik.errors.newPassword}</div>
            ) : null}

            <Button type={'submit'} className={`btn-success submit mt-4`}>
                Submit
            </Button>
        </form>
    );
}
