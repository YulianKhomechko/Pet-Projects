import { isEmailValid, isNameValid, isPasswordValid } from '../../../utils';
import { nameMaxLength, nameMinLength } from '../../employees/employeesValidator';
import { formikValidator } from '../../formikValidator';
import messages from '../../messages';

const { invalidEmail, invalidPassword } = messages;

export default (values: { [key: string]: any; }) => {
    return formikValidator(values, {
        firstName: {
            required: true,
            validate: {
                validator: isNameValid,
                minLength: nameMinLength,
                maxLength: nameMaxLength
            }
        },
        lastName: {
            required: true,
            validate: {
                validator: isNameValid,
                minLength: nameMinLength,
                maxLength: nameMaxLength
            }
        },
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
};
