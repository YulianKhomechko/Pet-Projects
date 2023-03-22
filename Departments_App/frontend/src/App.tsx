import { Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, LoadingSpinner, Modal } from './components/_common';
import { selectAuth } from './store/authSlice';
import { chatThunk } from './thunks/chatThunk';
import { useAppDispatch, useAppSelector } from './store/hooks';
import RouterComponent from './components/_common/RouterComponent';

export const App = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { userId } = useAppSelector(selectAuth);

    useEffect(() => {
        if (!userId) {
            return;
        }
        dispatch(chatThunk({ navigate, userId }));
    }, [userId]);

    return (
        <>
            <Modal />
            <Header />
            <Suspense
                fallback={
                    <div className={'centered'}>
                        <LoadingSpinner />
                    </div>
                }>
                <RouterComponent />
            </Suspense>
        </>
    );
};
