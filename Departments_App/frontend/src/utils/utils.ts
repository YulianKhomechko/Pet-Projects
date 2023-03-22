export const isNameValid = (name: string) => /^[a-zA-Z\s-]+$/.test(name);

export const isEmailValid = (email: string) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

export const isPasswordValid = (password: string) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

export const isDateValid = (min: string, date: string) => {
    const dateTimestamp = new Date(date).getTime();
    return (
        !!dateTimestamp &&
        dateTimestamp > new Date(min).getTime() &&
        dateTimestamp < new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * 18
    );
};

export const isFormikShowError = (formik: any, fieldName: string) =>
    formik.touched[fieldName] && formik.errors[fieldName];
