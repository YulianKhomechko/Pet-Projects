import { selectChats } from '../../store/chatsSlice';
import ChatListItem from './ChatListItem';
import styles from './ChatPage/ChatPage.module.scss';
import { useAppSelector } from '../../store/hooks';
import { Chat } from '../../models/Chat';

export default function ChatList({ chats }: { chats: Chat[] }) {
    const { unreadMessages } = useAppSelector(selectChats);

    return (
        <div className={`col-span-1 ${styles['chat-page--height']} border-r-2 border-gray-300 overflow-y-auto`}>
            <h3 className="text-center border-b-2 border-gray-300 py-1">Chat List</h3>
            {chats.length === 0 && <h4 className="mt-2 text-center">No chats found</h4>}
            {chats.map((chat) => (
                <ChatListItem
                    key={chat.id}
                    id={chat.id}
                    chat={chat}
                    unreadMessages={unreadMessages.filter((message) => message.chatId === chat.id)}
                />
            ))}
        </div>
    );
}
