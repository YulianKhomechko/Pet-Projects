import { Outlet, useLocation } from 'react-router-dom';
import { selectChats } from '../../../store/chatsSlice';
import ChatList from '../ChatList';
import { useAppSelector } from '../../../store/hooks';

export default function ChatPage() {
    const { chats } = useAppSelector(selectChats);
    const { pathname } = useLocation();

    return (
        <div className={`grow grid grid-cols-5`}>
            <ChatList chats={chats} />
            {pathname === '/chat' && (
                <div className="col-span-4 flex items-center justify-center bg-gradient-to-bl from-gray-50 to-gray-100">
                    <h3>Please, select a chat</h3>
                </div>
            )}
            <Outlet />
        </div>
    );
}
