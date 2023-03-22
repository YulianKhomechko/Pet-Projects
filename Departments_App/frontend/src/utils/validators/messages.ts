export default {
    requiredField: 'This field is required!',
    invalidData: 'Please, enter a valid data.',
    invalidEmail: 'Email should look like this: example@mail.com',
    invalidPassword: 'Password should have minimum 8 characters, at least one letter and one number.',
    minmaxDate: (min: string) => {
        return `Birth date should be greater or equal than ${min}. Employee should be at least 18 years old.`;
    }
};
