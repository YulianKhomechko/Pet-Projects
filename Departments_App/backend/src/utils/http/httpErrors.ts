export enum httpErrors {
    clientError = 'Client error: bad request.',
    serverError = 'Server error. Please try again later...',

    unauthorized = 'You are not authorized.',
    notAllowed = 'You are not allowed to perform this action.',
    entityNotExist = 'This entity does not exist.',
    invalidData = 'Sent data is invalid!',

    containsChildren = 'Cannot delete: entity contains children.'
}

export const employeeNotBelongToDepartment = (employeeId: number) => {
    return `Employee with id: ${employeeId} does not belong to this department.`;
};
