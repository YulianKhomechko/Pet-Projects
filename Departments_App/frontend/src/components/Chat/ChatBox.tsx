import { PaperAirplaneIcon } from '@heroicons/react/solid';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MESSAGE_CREATE, MESSAGE_RETRIEVE } from '../../constants/socket.io';
import { socket } from '../../services/socket.io';
import { selectAuth } from '../../store/authSlice';
import { selectChats } from '../../store/chatsSlice';
import ChatMessage from './ChatMessage';
import styles from './ChatPage/ChatPage.module.scss';
import { useAppSelector } from '../../store/hooks';

export default function ChatBox() {
    const { userId } = useAppSelector(selectAuth);
    const { messages } = useAppSelector(selectChats);
    const { chatId } = useParams();
    const chatBoxBottomRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [message, setMessage] = useState('');

    useEffect(() => {
        socket.emit(MESSAGE_RETRIEVE, chatId);
    }, [chatId]);

    useEffect(() => {
        chatBoxBottomRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message, messages]);

    const handleTextareaChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(ev.target.value);

        if (textareaRef !== undefined) {
            textareaRef!.current!.style.height = '48px';
            textareaRef!.current!.style.height =
                parseInt(textareaRef!.current!.style.height, 10) < 120
                    ? textareaRef!.current!.scrollHeight + 'px'
                    : '120px';
        }
    };

    const handleSendMessage = () => {
        if (message.trim() === '') {
            return;
        }
        socket.emit(MESSAGE_CREATE, { userId, chatId: +chatId!, text: message });
        setMessage('');
    };

    return (
        <div className={`relative col-span-4 flex flex-col ${styles['chat-page--height']} overflow-y-auto`}>
            <div className="grow flex flex-col gap-3 p-4 items-start bg-gradient-to-bl from-gray-50 to-gray-100">
                {messages && messages.length === 0 && <h3 className="self-center">No messages yet...</h3>}
                {messages &&
                    messages
                        .filter((message) => +message.chatId === +chatId!)
                        .map((message) => (
                            <ChatMessage
                                key={message.id}
                                id={message.id}
                                firstName={message.user.firstName}
                                lastName={message.user.lastName}
                                text={message.text}
                                createdAt={message.createdAt}
                                userId={message.userId}
                            />
                        ))}
            </div>

            <div className="sticky max-h-fit bottom-0 left-0 ">
                <textarea
                    style={{ height: 48, maxHeight: 120 }}
                    ref={textareaRef}
                    value={message}
                    placeholder="Type message here..."
                    onChange={handleTextareaChange}
                    className="w-full mb-[-7px] border-t-2 border-gray-300 p-2 pr-12 focus:outline-blue-400 focus:border-none resize-none"></textarea>
                <PaperAirplaneIcon
                    className="absolute top-[50%] right-0 translate-y-[-50%] rotate-90 w-5 h-5 mr-4 text-blue-400 hover:cursor-pointer hover:text-blue-600 active:text-blue-300"
                    onClick={handleSendMessage}
                />
            </div>
            <div ref={chatBoxBottomRef}></div>
        </div>
    );
}
