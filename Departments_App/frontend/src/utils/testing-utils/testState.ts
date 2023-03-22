import { userRoles } from '../../constants/userRoles';
import { ResponseError } from '../../models/ResponseError';
import { modalSuccess } from '../../constants/modalTypes';

const testUserId = 1;
const testUserFirstName = 'Yulian';
const testUserLastName = 'Khomechko';
const testError = null;

export const generateAuthState = (
    role: userRoles,
    id: number = testUserId,
    firstName: string = testUserFirstName,
    lastName: string = testUserLastName,
    error: ResponseError | null = testError
) => ({ userRole: role, userId: id, userFirstName: firstName, userLastName: lastName, error: error });

const testModalType = modalSuccess;
const testModalTitle = 'Test Title';
const testModalText = 'Test Text';
const testModalAction = null;
const testModalError = '';

export const generateModalState = (
    modalIsVisible: boolean,
    type: string | undefined = testModalType,
    title: string | undefined = testModalTitle,
    text: string | undefined = testModalText,
    action: (() => void) | null | undefined = testModalAction,
    error: string | undefined = testModalError
) => ({
    modalIsVisible,
    type,
    title,
    text,
    action,
    error
});
