import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { selectAuth } from '../../store/authSlice';
import { clearUnreadMessages } from '../../store/chatsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Chat } from '../../models/Chat';
import { ChatMessage } from '../../models/ChatMessage';

export default function ChatListItem({
    id,
    chat,
    unreadMessages
}: {
    id: number;
    chat: Chat;
    unreadMessages: ChatMessage[];
}) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { userId } = useAppSelector(selectAuth);

    const { chatId } = useParams();

    const [receiver, setReceiver] = useState<{ id: number; firstName: string; lastName: string }>();

    useEffect(() => {
        setReceiver(chat.users.find((user) => +user.id !== +userId!));
    }, [chat, userId]);

    const handleClick = () => {
        navigate(`${id}`, { replace: true });
        dispatch(clearUnreadMessages(id));
    };

    return (
        <div
            className={`flex items-center border-b-2 border-gray-300 py-2 px-4 ${
                +id === +chatId! ? 'bg-gray-300' : ''
            } hover:cursor-pointer hover:bg-gray-200 active:bg-gray-300`}
            onClick={handleClick}>
            <span>{receiver && `${receiver.firstName} ${receiver.lastName}`}</span>
            {unreadMessages.length > 0 && (
                <div className="flex justify-center items-center ml-auto bg-gray-500 text-white rounded-full w-6 h-6">
                    {unreadMessages.length}
                </div>
            )}
        </div>
    );
}
