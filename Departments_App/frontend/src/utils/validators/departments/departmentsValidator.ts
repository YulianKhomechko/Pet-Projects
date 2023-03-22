import { isNameValid } from '../../utils';
import { formikValidator } from '../formikValidator';

const nameMinLength = 2;
const nameMaxLength = 40;
const headMinLength = 2;
const headMaxLength = 40;
const descriptionMinLength = 0;
const descriptionMaxLength = 200;

export default (values: { [key: string]: any; }) => {
    return formikValidator(values, {
        name: {
            required: true,
            validate: {
                validator: isNameValid,
                minLength: nameMinLength,
                maxLength: nameMaxLength
            }
        },
        head: {
            required: true,
            validate: {
                validator: isNameValid,
                minLength: headMinLength,
                maxLength: headMaxLength
            }
        },
        description: {
            required: false,
            validate: {
                minLength: descriptionMinLength,
                maxLength: descriptionMaxLength
            }
        }
    });
};
