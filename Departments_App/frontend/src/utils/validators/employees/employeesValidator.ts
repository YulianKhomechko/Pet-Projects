import { isDateValid, isEmailValid, isNameValid } from '../../utils';
import { formikValidator } from '../formikValidator';
import messages from '../messages';

const { invalidEmail, minmaxDate } = messages;

export const nameMinLength = 2;
export const nameMaxLength = 20;
const salaryMin = 100;
const salaryMax = 99999;
const dateMin = '1901-01-01';

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
        birthDate: {
            required: true,
            validate: {
                validator: isDateValid.bind(null, dateMin),
                message: minmaxDate(dateMin)
            }
        },
        salary: {
            required: true,
            validate: {
                min: salaryMin,
                max: salaryMax
            }
        }
    });
};
