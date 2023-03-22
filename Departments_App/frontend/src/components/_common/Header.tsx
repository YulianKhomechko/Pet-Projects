import { ChatAlt2Icon, LogoutIcon, UserIcon } from '@heroicons/react/outline';
import { HomeIcon, XIcon } from '@heroicons/react/solid';
import Tippy from '@tippyjs/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectAuth } from '../../store/authSlice';
import { selectChats } from '../../store/chatsSlice';
import { logoutThunk } from '../../thunks/authThunk';
import { Button } from './index';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export default function Header() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { userId } = useAppSelector(selectAuth);
    const { unreadMessages } = useAppSelector(selectChats);

    const logoutHandler = () => {
        dispatch(logoutThunk());
    };

    return (
        <header className={`border-b-2 border-gray-200  ${!userId ? 'hidden' : ''}`}>
            <div className="py-4 px-8 max-w-[1440px] mx-auto">
                {userId && (
                    <div className="flex gap-2 justify-between ">
                        {pathname.startsWith('/chat') && (
                            <>
                                <Tippy content="Close">
                                    <Button className="btn btn-danger" onClick={() => navigate(-1)}>
                                        <XIcon className="w-7 h-7" />
                                    </Button>
                                </Tippy>

                                <Tippy content="Main Page">
                                    <Button className="btn btn-primary" onClick={() => navigate('/')}>
                                        <HomeIcon className="w-7 h-7" />
                                    </Button>
                                </Tippy>
                            </>
                        )}
                        {!pathname.startsWith('/chat') && (
                            <Tippy content="Chat">
                                <Button className="relative btn btn-primary mr-auto" onClick={() => navigate('/chat')}>
                                    <ChatAlt2Icon className="w-7 h-7" />
                                    {unreadMessages.length > 0 && (
                                        <div className="absolute top-[-5px] right-[-5px] w-5 h-5 rounded-full bg-red-500"></div>
                                    )}
                                </Button>
                            </Tippy>
                        )}

                        <div className="flex gap-2 justify-self-end ml-auto">
                            <Tippy content="Profile">
                                <Button className="btn btn-primary" onClick={() => navigate('/user')}>
                                    <UserIcon className="w-7 h-7" />
                                </Button>
                            </Tippy>
                            <Tippy content="Logout">
                                <Button className="btn-success" onClick={logoutHandler}>
                                    <LogoutIcon className="w-7 h-7" />
                                </Button>
                            </Tippy>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
