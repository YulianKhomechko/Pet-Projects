import { selectAuth } from '../../store/authSlice';
import { useAppSelector } from '../../store/hooks';

interface ChatMessageProps {
    id?: number;
    userId: number;
    firstName: string;
    lastName: string;
    text: string;
    createdAt: string;
}

export default function ChatMessage({
    id,
    userId: currentMessageUserId,
    firstName,
    lastName,
    text,
    createdAt
}: ChatMessageProps) {
    const { userId } = useAppSelector(selectAuth);

    return (
        <div
            className={`py-2 px-4 rounded-lg shadow-md ${
                +userId! === +currentMessageUserId ? 'self-end bg-blue-200' : 'bg-white'
            }`}>
            <div>
                <span className="font-semibold">
                    {firstName} {lastName}
                </span>
                <time className="ml-4 text-gray-400">
                    {new Date(createdAt).toLocaleDateString(navigator.language, {
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </time>
            </div>
            <p>{text}</p>
        </div>
    );
}
