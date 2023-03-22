interface ChatUser {
    id: number;
    firstName: string;
    lastName: string;
}

export interface Chat {
    id: number;
    userId: number;
    chatName: string | null;
    createdAt: string;
    updatedAt: string;
    users: ChatUser[];
}
