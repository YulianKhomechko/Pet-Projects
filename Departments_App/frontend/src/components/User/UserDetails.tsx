import { LockClosedIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, LoadingSpinner } from '../_common';
import { selectAuth } from '../../store/authSlice';
import { fetchUser } from '../../thunks/usersThunk';
import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { User } from '../../models/User';

export default function UserDetails() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const dispatch = useAppDispatch();
    const { userId } = useAppSelector(selectAuth);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User>();

    useEffect(() => {
        setIsLoading(true);
        dispatch(fetchUser(userId!))
            .unwrap()
            .then(({ data }: { data: User }) => {
                setIsLoading(false);
                setUser(data);
            })
            .catch(() => navigate(-1));
    }, []);

    return (
        <div className="details-container">
            <Button className="btn btn-primary ml-auto" onClick={() => navigate('../', { replace: true })}>
                Back
            </Button>
            <h3 className="font-bold uppercase my-4">User Profile</h3>
            {isLoading && (
                <div className={'centered'}>
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && user && (
                <>
                    <h5>
                        <span className="font-bold">First Name: </span>
                        {user.firstName}
                    </h5>
                    <h5>
                        <span className="font-bold">Last Name: </span>
                        {user.lastName}
                    </h5>
                    <h5>
                        <span className="font-bold">Role: </span>
                        {user.role}
                    </h5>
                    <h5>
                        <span className="font-bold">Email: </span>
                        {user.email}
                    </h5>

                    <Button
                        className="btn btn-primary mt-4"
                        onClick={() => (pathname.endsWith('/password') ? navigate('') : navigate('password'))}>
                        <LockClosedIcon className="w-5 h-5 mr-2" /> Change Password
                    </Button>

                    <Outlet />
                </>
            )}
        </div>
    );
}
