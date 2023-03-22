import messages from './messages';

type TypeOptions = {
    [key: string]: {
        required?: boolean;
        validate?: {
            validator?: (value: any) => boolean;
            message?: string;
            minLength?: number;
            maxLength?: number;
            min?: number;
            max?: number;
        };
    };
};

const { requiredField, invalidData } = messages;

export const formikValidator = (values: { [key: string]: any }, options: TypeOptions) => {
    const errors: {
        [key: string]: string;
    } = {};

    for (const value in values) {
        if (!options[value]) {
            throw new Error(`There is no key "${value}" in provided options.`);
        }

        const { required, validate } = options[value];
        const { validator, message, minLength, maxLength, min, max } = validate || {};

        if (required && !values[value]) {
            errors[value] = requiredField;
            continue;
        }

        if (validator && !validator(values[value])) {
            errors[value] = message || invalidData;
            continue;
        }

        if (minLength && values[value].length < minLength) {
            errors[value] = `Value should contain at least ${minLength} characters.`;
            continue;
        }

        if (maxLength && values[value].length > maxLength) {
            errors[value] = `Value should contain less than ${maxLength} characters.`;
            continue;
        }

        if (min && values[value] < min) {
            errors[value] = `Value should be greater than ${min}.`;
            continue;
        }

        if (max && values[value] > max) {
            errors[value] = `Value should be less than ${max}.`;
            continue;
        }
    }

    return errors;
};
