import { userRoles } from '../constants/userRoles';

export interface JWTPayload {
    userId: number;
    userRole: userRoles;
    userFirstName: string;
    userLastName: string;
}
