export interface ChatMessage {
    id: number;
    chatId: number;
    userId: number;
    text: string;
    createdAt: string;
    updatedAt: string;
    user: {
        firstName: string;
        lastName: string;
    };
}
