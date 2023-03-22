import { formikValidator } from '../../formikValidator';
import { isEmailValid, isPasswordValid } from '../../../utils';
import messages from '../../messages';

const { invalidEmail, invalidPassword } = messages;

export default function loginValidator(values: { [key: string]: any; }) {
    return formikValidator(values, {
        email: {
            required: true,
            validate: {
                validator: isEmailValid,
                message: invalidEmail
            }
        },
        password: {
            required: true,
            validate: {
                validator: isPasswordValid,
                message: invalidPassword
            }
        }
    });
}
