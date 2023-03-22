import { Navigate, useNavigate } from 'react-router-dom';
import { selectAuth } from '../../store/authSlice';
import { useAppSelector } from '../../store/hooks';
import { FC, LazyExoticComponent } from 'react';
import { userRoles } from '../../constants/userRoles';

interface ProtectedRouteProps {
    component: FC | LazyExoticComponent<any>;
    redirectTo?: string;
    allowedTo?: userRoles[];
}

export default function ProtectedRoute({ component: Component, redirectTo, allowedTo, ...rest }: ProtectedRouteProps) {
    const { userId, userRole } = useAppSelector(selectAuth);
    const navigate = useNavigate();

    if (!userId) {
        return <Navigate to={redirectTo || '/login'} replace={true} />;
    }

    if (allowedTo && !allowedTo.includes(userRole!)) {
        // return <Navigate to={-1} replace={true}/>;
        navigate(-1);
        return <></>;
    }

    return <Component {...rest} />;
}
