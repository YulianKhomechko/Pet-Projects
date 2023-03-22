type ActionType = { type: string };

// Pending
export const isThunkPending = ({ type }: ActionType) => type.endsWith('/pending');

export const isDepartmentsPending = ({ type }: ActionType) =>
    type.startsWith('departments') && !type.startsWith('departments/fetchDepartments') && type.endsWith('/pending');

export const isEmployeesPending = ({ type }: ActionType) =>
    type.startsWith('employees') && !type.startsWith('employees/fetchEmployees') && type.endsWith('/pending');

// Fulfilled
export const isThunkFulfilled = ({ type }: ActionType) => type.endsWith('/fulfilled');

export const isDepartmentsFulfilled = ({ type }: ActionType) =>
    type.startsWith('departments') && type.endsWith('/fulfilled');

export const isEmployeesFulfilled = ({ type }: ActionType) =>
    type.startsWith('employees') && type.endsWith('/fulfilled');

export const isAuthFulfilled = ({ type }: ActionType) => type.startsWith('auth') && type.endsWith('/fulfilled');

// Rejected
export const isThunkRejected = ({ type }: ActionType) => type.endsWith('/rejected');

export const isDepartmentsRejected = ({ type }: ActionType) =>
    type.startsWith('departments') && type.endsWith('/rejected');

export const isEmployeesRejected = ({ type }: ActionType) => type.startsWith('employees') && type.endsWith('/rejected');

export const isAuthRejected = ({ type }: ActionType) => type.startsWith('auth') && type.endsWith('/rejected');
